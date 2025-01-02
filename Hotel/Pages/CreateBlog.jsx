import { getPosts, getPost, createPost, updatePost, deletePost, getActive, getActives, UpdateActive, deleteActive, NewActive } from '../src/api'
import { useEffect, useState } from 'react'
import './Style/CreateBlog.css'
import Hotel1 from '../src/assets/Video/Hotel1.jpg'
import Hotel2 from '../src/assets/Video/Hotel2.jpg'
import * as jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function CreateBlog() {

    useEffect(() => {
        async function loadUserData() {
            try {
                if (token !== null) {
                    setUsers(decodedUser)
                    ableh(false);
                } else {
                    ableh(true);
                }
            } catch (error) {

            }
            // const KamarHotel = await getPosts()
            // const filteredKamar = KamarHotel.filter((kamar) => post.author == decodeUser._id)
            // setPosts (filteredKamar)
        }
        loadUserData()
        
    }, []);

    const [rooms, setRooms] = useState([]);
    const token = sessionStorage.getItem("User")
    const [spinners, setSpinners] = useState({});
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [dates, setDates] = useState({
        checkin: {},
        checkout: {},
    });
    const [active, setActive] = useState([]);
    const [disabledDates, setDisabledDates] = useState(new Set());
    let decodedUser
    try {
        decodedUser = jwt_decode.jwtDecode(token)
    } catch (error) {

    }


    const isDateDisabledForActive = (roomNumber, date) => {
        const formattedDate = date.toISOString().split("T")[0];
        const roomActive = active.filter((act) => act.roomId === roomNumber);

        return roomActive.some(
            (act) =>
                formattedDate >= act.checkin &&
                formattedDate <= act.checkout
        );
        
    };

    const getDisabledDatesForRoom = (roomNumber) => {
        const roomActive = active.filter((act) => act.roomId === roomNumber);

        const disabledDates = [];
        roomActive.forEach((act) => {
            let currentDate = new Date(act.checkin);
            const endDate = new Date(act.checkout);

            // Tambahkan semua tanggal dalam rentang checkin dan checkout
            while (currentDate <= endDate) {
                disabledDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return disabledDates; // Daftar tanggal yang tidak dapat dipilih
    };


    useEffect(() => {
        async function loadKamar() {
            let data = await getPosts();
            if (data) {
                // Normalisasi tanggal Checkin dan Checkout
                data.forEach((room) => {
                    room.Checkin = normalizeDate(room.Checkin);
                    room.Checkout = normalizeDate(room.Checkout);
                });
                setRooms(data);
            }
        }
        loadKamar();
    }, []);

    useEffect(() => {
        async function loadActiveRooms() {
            let data = await getActives();
            if (data) {
                data.forEach((active) => {
                    active.checkin = normalizeDate(active.checkin).toISOString().split("T")[0];
                    active.checkout = normalizeDate(active.checkout).toISOString().split("T")[0];
                });
                console.log("Active data:", data); // Debugging
                setActive(data);
            }
        }
        loadActiveRooms();
    }, []);


    const handleSpinnerChange = (roomNumber, value) => {
        if (!dates[roomNumber]) return;

        setSpinners((prevSpinners) => ({
            ...prevSpinners,
            [roomNumber]: value,
        }));
    };

    const calculateCheckoutDate = (checkInDate, daysToAdd) => {
        const date = new Date(checkInDate); // Buat salinan tanggal
        date.setDate(date.getDate() + daysToAdd); // Tambahkan hari
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    };


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        console.log("Checkbox value:", value, "Checked:", checked);

        if (checked) {
            if (!selectedRooms.includes(value)) {
                const defaultDate = getDefaultDate(value);
                setSelectedRooms((prevSelected) => [...prevSelected, value]);
                setSpinners((prevSpinners) => ({
                    ...prevSpinners,
                    [value]: 1,
                }));
                setDates((prevDates) => ({
                    ...prevDates,
                    [value]: defaultDate.toISOString().split("T")[0],
                }));
            }
        } else {
            setSelectedRooms((prevSelected) =>
                prevSelected.filter((roomNumber) => roomNumber !== value)
            );
            setSpinners((prevSpinners) => {
                const newSpinners = { ...prevSpinners };
                delete newSpinners[value];
                return newSpinners;
            });
            setDates((prevDates) => {
                const newDates = { ...prevDates };
                delete newDates[value];
                return newDates;
            });
        }
    };



    // const updateHotel = async () => {
    //     if (!decodedUser?._id) {
    //         console.log("User tidak valid!");
    //         return;
    //     }

    //     if (selectedRooms.length === 0) {
    //         console.log("Tidak ada kamar yang dipilih untuk diupdate!");
    //         return;
    //     }

    //     console.log("Rooms Terpilih:", selectedRooms);

    //     for (const roomNumber of selectedRooms) {
    //         const roomToUpdate = rooms.find((room) => room.NomorKamar === parseInt(roomNumber, 10));
    //         console.log("Room to Update:", roomToUpdate);

    //         if (roomToUpdate) {
    //             const checkInDate = dates[roomNumber];
    //             const spinnerDays = spinners[roomNumber] || 1;
    //             const checkOutDate = calculateCheckoutDate(checkInDate, spinnerDays);

    //             const updatedRoom = {
    //                 ...roomToUpdate,
    //                 Occupier: decodedUser._id,
    //                 Checkin: checkInDate,
    //                 Checkout: checkOutDate,
    //             };

    //             try {
    //                 console.log("Mengirim Update untuk Room:", updatedRoom);
    //                 await updatePost(roomToUpdate._id, updatedRoom);
    //                 console.log(`Kamar ${roomNumber} berhasil diupdate.`);
    //             } catch (error) {
    //                 console.error(`Gagal mengupdate kamar ${roomNumber}:`, error);
    //             }
    //         }
    //     }

    //     alert("Semua kamar yang dipilih telah diupdate!");
    // };



    const submitReservation = async () => {
        if (!decodedUser?._id) {
            console.log("User tidak valid!");
            return;
        }

        if (selectedRooms.length === 0) {
            console.log("Tidak ada kamar yang dipilih untuk reservasi!");
            return;
        }

        for (const roomNumber of selectedRooms) {
            const checkInDate = dates[roomNumber]; // Ambil check-in dari state dates
            const spinnerDays = spinners[roomNumber] || 1;
            const checkOutDate = calculateCheckoutDate(checkInDate, spinnerDays);

            const newActiveHotel = {
                userId: decodedUser._id,
                roomId: roomNumber,
                checkin: checkInDate, // Gunakan tanggal check-in dari state
                checkout: checkOutDate,
            };

            try {
                console.log("Membuat entri baru untuk ActiveHotel:", newActiveHotel);
                await NewActive(newActiveHotel);
                console.log(`Reservasi untuk kamar ${roomNumber} berhasil dibuat.`);
            } catch (error) {
                console.error(`Gagal membuat reservasi untuk kamar ${roomNumber}:`, error);
            }
        }

        alert("Reservasi berhasil dibuat!");
        setSelectedRooms([]); // Reset kamar yang dipilih
        setDates({}); // Reset tanggal
        setSpinners({}); // Reset spinner
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        Hotel1,
        Hotel2,
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const [reserve, setreserve] = useState(false)
    const reservasi = () => {
        setreserve(false)
    }

    const handleDateChange = (roomNumber, date) => {
        if (!date) return;

        const formattedDate = date.toISOString().split("T")[0]; // Format menjadi YYYY-MM-DD

        // Validasi apakah tanggal termasuk dalam tanggal yang dinonaktifkan
        if (isDateDisabledForActive(roomNumber, date)) {
            alert("Tanggal yang dipilih sudah dipesan. Silakan pilih tanggal lain.");
            return;
        }

        // Perbarui tanggal check-in di state dates
        setDates((prevDates) => ({
            ...prevDates,
            [roomNumber]: formattedDate, // Tetapkan tanggal check-in untuk kamar tertentu
        }));

        // Reset spinner ke 1 untuk kamar tersebut
        setSpinners((prevSpinners) => ({
            ...prevSpinners,
            [roomNumber]: 1,
        }));
    };


    const getDefaultDate = (roomNumber) => {
        const today = new Date();
        let nextValidDate = new Date(today);

        // Cek apakah hari ini dinonaktifkan
        while (isDateDisabledForActive(roomNumber, nextValidDate)) {
            nextValidDate.setDate(nextValidDate.getDate() + 1); // Cari tanggal berikutnya
        }

        return nextValidDate;
    };

    const normalizeDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Set waktu ke 00:00:00
    };



    return (

        <>
            <p></p>
            <button onClick={() => setreserve(true)}>
                Reserve Now !!!
            </button>
            {reserve && (
                <div className="KotakLogin">


                    <div className="IsiKotakLogin">
                        <form className="Submit-Reservasi" >
                            <div className="carousel">
                                <div
                                    className="carousel-container"
                                    style={{
                                        transform: `translateX(-${currentIndex * 100}%)`,
                                    }}
                                >
                                    {slides.map((slide, slideIndex) => (
                                        <div className="carousel-slide" key={slideIndex}>
                                            <img src={slide} alt={`Slide ${slideIndex + 1}`} />

                                            <div className="checkbox-container">
                                                {Array.from({ length: 10 }).map((_, checkboxIndex) => (
                                                    <label key={`${slideIndex}-${checkboxIndex}`}>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${slideIndex}-${checkboxIndex}`}
                                                            name={`checkbox-${slideIndex}-${checkboxIndex}`}
                                                        />
                                                        Option {checkboxIndex + 1}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-btn prev" onClick={handlePrev}>
                                    ❮
                                </button>
                                <button className="carousel-btn next" onClick={handleNext}>
                                    ❯
                                </button>
                                <div className="carousel-indicators">
                                    {slides.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`indicator ${currentIndex === index ? "active" : ""
                                                }`}
                                            onClick={() => setCurrentIndex(index)}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {/* //Logikaa */}
                                {rooms.map((room) => (
                                    <div key={room?.NomorKamar} className={`kamar-${room?.NomorKamar}`}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={room?.NomorKamar}
                                                onChange={handleCheckboxChange}
                                            />
                                            {room?.NomorKamar}
                                        </label>
                                        {selectedRooms.includes(`${room?.NomorKamar}`) && (
                                            <>
                                                <DatePicker
                                                    selected={
                                                        dates[room?.NomorKamar]
                                                            ? new Date(dates[room?.NomorKamar])
                                                            : getDefaultDate(room?.NomorKamar)
                                                    }
                                                    minDate={new Date()}
                                                    excludeDates={getDisabledDatesForRoom(room?.NomorKamar)} // Masukkan daftar tanggal yang tidak dapat dipilih
                                                    onChange={(date) => handleDateChange(room?.NomorKamar, date)}
                                                />

                                                <input
                                                    type="number"
                                                    value={spinners[room?.NomorKamar] || 1}
                                                    min={1}
                                                    onChange={(e) =>
                                                        handleSpinnerChange(
                                                            room?.NomorKamar,
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                                <p>
                                                    Checkout:{" "}
                                                    {dates[room?.NomorKamar]
                                                        ? calculateCheckoutDate(
                                                            dates[room?.NomorKamar],
                                                            spinners[room?.NomorKamar] || 1
                                                        )
                                                        : "Pilih Check-in"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ))}




                                {/* Logika */}
                            </div>

                            <div></div>
                            <button onClick={submitReservation}>Submit</button>
                        </form>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="back" onClick={reservasi} className="outlogin">
                            <path fill="#373737" d="M126.2,68.5c-0.2-4.4-1.2-8.8-2.8-12.9c-1.6-4.1-4-8-6.9-11.4c-1.5-1.7-3-3.3-4.8-4.7c-0.4-0.4-0.9-0.7-1.3-1.1
	                                c-0.4-0.3-0.9-0.7-1.4-1l-1.4-0.9c-0.5-0.3-1-0.6-1.4-0.9c-1.9-1.1-4-2.1-6.1-3c-2.1-0.8-4.3-1.5-6.5-1.9c-2.2-0.5-4.5-0.8-6.8-0.8
	                                l-0.8,0l-0.6,0l-1.2,0l-2.4-0.1l-19.4-0.7l-23.8-0.8v-7.8c0-1.8-2-2.8-3.5-1.9l-13.9,9.2L11,34.7l-8.2,5.5c-1.3,0.9-1.3,2.8,0,3.7
	                                l8.2,5.5l10.4,6.9l13.9,9.2c1.5,1,3.5-0.1,3.5-1.9v-7.8l23.8-0.8l19.4-0.7l4.6-0.2c1-0.1,1.9,0,2.9,0.1c0.9,0.1,1.9,0.3,2.8,0.6
	                                c0.9,0.3,1.8,0.6,2.7,1.1c0.2,0.1,0.4,0.2,0.7,0.3c0.2,0.1,0.4,0.2,0.6,0.4l0.6,0.4c0.2,0.1,0.4,0.3,0.6,0.4
	                                c0.8,0.6,1.6,1.2,2.3,1.9c1.4,1.4,2.6,3.1,3.5,4.9c0.9,1.8,1.5,3.8,1.8,5.8c0.1,1,0.2,2.1,0.1,3.1c0,1-0.2,2.1-0.4,3.1
	                                c-0.2,1-0.5,2-0.9,3c-0.4,1-0.8,2-1.4,2.9c-1.1,1.8-2.5,3.6-4.2,5c-0.8,0.7-1.7,1.4-2.7,1.9c-0.9,0.6-1.9,1.1-3,1.5
	                                c-2,0.8-4.3,1.3-6.5,1.4l-0.4,0c-4.5,0.3-8.2,4-8.3,8.7c-0.1,4.9,3.8,9,8.7,9.1c4.2,0.1,8.4-0.4,12.5-1.7c2-0.6,4-1.4,5.9-2.4
	                                c1.9-1,3.7-2.1,5.4-3.3c3.5-2.5,6.5-5.6,9-9.2c1.2-1.8,2.3-3.6,3.3-5.6c0.9-2,1.7-4,2.3-6.1C125.9,77.3,126.4,72.9,126.2,68.5z"></path>
                        </svg>
                    </div>
                </div>
            )}


        </>
    )
}
