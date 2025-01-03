import { getPosts, getPost, createPost, updatePost, deletePost, getActive, getActives, UpdateActive, deleteActive, NewActive, deleteUsers } from '../src/api'
import { useEffect, useState } from 'react'
import './Style/Restaurant.css'
import resto1 from '../src/assets/Video/Resto1.jpg'
import resto2 from '../src/assets/Video/Resto2.jpg'
import * as jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Profile() {
    const [rooms, setRooms] = useState([]);
    const token = sessionStorage.getItem("User")
    const [spinners, setSpinners] = useState({});
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [dates, setDates] = useState({
        checkin: {},
        checkout: {},
    });
    const [reserves, setreserves] = useState(false)
    const reservasi = () => {
        setreserves(false)
    }
    const [active, setActive] = useState([]);
    const [disabledDates, setDisabledDates] = useState(new Set());
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        resto1,
        resto2,
    ];
    let decodedUser
    try {
        decodedUser = jwt_decode.jwtDecode(token)
    } catch (error) {

    }

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
        }
        loadUserData()

    }, []);

    useEffect(() => {
        async function loadActiveRooms() {
            let data = await getActives();
            if (data) {
                data.forEach((active) => {
                    active.checkin = new Date(active.checkin).toISOString().split("T")[0];
                    active.checkout = new Date(active.checkout).toISOString().split("T")[0];
                });
                setActive(data);
            }
        }
        loadActiveRooms();
    }, []);

    useEffect(() => {
        async function loadKamar() {
            let data = await getPosts();
            if (data) {
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
                const normalizedData = data.map((active) => ({
                    ...active,
                    checkin: normalizeDate(active.checkin),
                    checkout: normalizeDate(active.checkout),
                }));
                setActive(normalizedData);
            }
        }
        loadActiveRooms();
    }, []);


    //TangalDisabler
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

            while (currentDate <= endDate) {
                disabledDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
        return disabledDates;
    };

    //spinner
    const isSpinnerDisabled = (nomorKamar) => {
        const room = rooms.find((room) => room.NomorKamar === parseInt(nomorKamar, 10));
        if (!room) return false;

        const roomId = room.roomId;
        const checkInDate = dates[nomorKamar];
        if (!checkInDate) return false;

        const spinnerDays = spinners[nomorKamar] || 1;
        const newCheckoutDate = calculateCheckoutDate(checkInDate, spinnerDays);

        const checkoutDateObj = new Date(newCheckoutDate);
        const disabledDates = getDisabledDatesForRoom(roomId);
        return disabledDates.some(
            (disabledDate) =>
                disabledDate.toISOString().split("T")[0] === checkoutDateObj.toISOString().split("T")[0]
        );
    };

    const getMaxSpinner = (nomorKamar) => {
        const room = rooms.find((room) => room.NomorKamar === parseInt(nomorKamar, 10));
        if (!room) return Infinity;

        const roomId = room.NomorKamar;
        const checkInDate = dates[nomorKamar];
        if (!checkInDate) return Infinity;

        const roomActiveDates = active
            .filter((act) => act.roomId === roomId)
            .map((act) => ({
                start: new Date(act.checkin),
                end: new Date(act.checkout),

            }));


        roomActiveDates.sort((a, b) => a.start - b.start);

        let maxSpinner = Infinity;
        const checkInDateObj = new Date(checkInDate);

        for (const { start } of roomActiveDates) {
            if (start > checkInDateObj) {
                maxSpinner = Math.floor((start - checkInDateObj) / (1000 * 60 * 60 * 24));
                break;
            }
        }
        console.log(maxSpinner)
        return maxSpinner;

    };

    const handleSpinnerChange = (nomorKamar, value) => {
        const room = rooms.find((room) => room.NomorKamar === parseInt(nomorKamar, 10));
        if (!room) {
            alert("Room not found!");
            return;
        }

        const roomId = room.roomId;
        const checkInDate = dates[nomorKamar];
        if (!checkInDate) {
            alert("Please select a check-in date first.");
            return;
        }

        const newCheckoutDate = calculateCheckoutDate(checkInDate, value);
        const checkoutDateObj = new Date(newCheckoutDate);
        const roomActiveDates = active
            .filter((act) => act.roomId === roomId)
            .map((act) => ({
                start: new Date(act.checkin),
                end: new Date(act.checkout),
            }));

        const isConflict = roomActiveDates.some(({ start, end }) =>
            checkoutDateObj >= start && checkoutDateObj <= end
        );

        if (isConflict) {
            alert(`Tanggal checkout ${newCheckoutDate} bertabrakan dengan reservasi lain. Tidak dapat menambahkan durasi.`);
            return;
        }
        setSpinners((prevSpinners) => ({
            ...prevSpinners,
            [nomorKamar]: value,
        }));

        console.log(`Spinner untuk kamar ${nomorKamar} diperbarui ke: ${value}`);
    };

    const calculateCheckoutDate = (checkInDate, daysToAdd) => {
        const date = new Date(checkInDate);
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().split("T")[0];
    };


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const intValue = parseInt(value, 10);

        if (checked) {
            if (!selectedRooms.includes(value)) {
                const defaultDate = getDefaultDate(value);
                setSelectedRooms((prevSelected) => [...prevSelected, value]);
                setDates((prevDates) => ({
                    ...prevDates,
                    [value]: defaultDate.toISOString().split("T")[0],
                }));
            }
        } else {
            setSelectedRooms((prevSelected) =>
                prevSelected.filter((roomNumber) => roomNumber !== value)
            );
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


    //SUBMITTT
    const submitReservation = async () => {
        if (!decodedUser?._id) {
            return;
        }

        if (selectedRooms.length === 0) {
            return;
        }

        for (const roomNumber of selectedRooms) {
            const checkInDate = dates[roomNumber];
            const spinnerDays = spinners[roomNumber] || 1;
            const checkOutDate = calculateCheckoutDate(checkInDate, spinnerDays);

            const newActiveHotel = {
                userId: decodedUser._id,
                roomId: parseInt(roomNumber, 10),
                checkin: checkInDate,
                checkout: checkOutDate,
            };

            try {
                await NewActive(newActiveHotel);
            } catch (error) {
            }
        }

        alert("Reservasi berhasil dibuat!");
        setSelectedRooms([]);
        setDates({});
        setSpinners({});
        window.location.reload()
    };


    //CARAUSELLLL
    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % 2;
            updateClasses(nextIndex + 1);
            return nextIndex;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const prevIndexValue = prevIndex === 0 ? 1 : prevIndex - 1;
            updateClasses(prevIndexValue + 1);
            return prevIndexValue;
        });
    };

    const updateClasses = (activeGroup) => {
        const allRooms = document.querySelectorAll('[class^="kamar-"]');

        allRooms.forEach((el) => {
            const currentClass = Array.from(el.classList).find((cls) =>
                cls.startsWith("kamar-")
            );

            if (currentClass) {
                el.classList.remove(currentClass);
            }
            const roomNumber = currentClass.split("-")[1];
            el.classList.add(`kamar-${roomNumber}-hidden`);
        });
        const start = activeGroup === 1 ? 1 : 13;
        const end = activeGroup === 1 ? 12 : 24;

        for (let i = start; i <= end; i++) {
            const element = document.querySelector(`.kamar-${i}-hidden`);
            if (element) {
                element.classList.remove(`kamar-${i}-hidden`);
                element.classList.add(`kamar-${i}`);
            }
        }
    };



    //Tanggalan
    const handleDateChange = (nomorKamar, date) => {
        if (!date) return;

        const room = rooms.find((room) => room.NomorKamar === parseInt(nomorKamar, 10));
        if (!room) {
            alert("Room not found!");
            return;
        }

        const roomId = room.roomId;
        const formattedDate = date.toISOString().split("T")[0];
        const roomActiveDates = active
            .filter((act) => act.roomId === roomId)
            .map((act) => ({
                start: new Date(act.checkin),
                end: new Date(act.checkout),
            }));

        const isConflict = roomActiveDates.some(({ start, end }) =>
            date >= start && date <= end
        );

        if (isConflict) {
            alert("Tanggal yang dipilih sudah dipesan. Silakan pilih tanggal lain.");
            return;
        }

        setDates((prevDates) => ({
            ...prevDates,
            [nomorKamar]: formattedDate,
        }));

        setSpinners((prevSpinners) => ({
            ...prevSpinners,
            [nomorKamar]: 1,
        }));

        console.log(`Tanggal untuk kamar ${nomorKamar} diubah ke: ${formattedDate}`);
    };

    const getDefaultDate = (nomorKamar) => {
        const room = rooms.find((room) => room.NomorKamar === parseInt(nomorKamar, 10));
        if (!room) {
            console.error("Room not found!");
            return new Date();
        }

        const roomId = room.roomId;
        let today = new Date();
        let nextValidDate = new Date(today);
        const excludedDates = active
            .filter((act) => act.roomId === roomId)
            .flatMap((act) => {
                let currentDate = new Date(act.checkin);
                const endDate = new Date(act.checkout);
                const dates = [];
                while (currentDate <= endDate) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dates;
            });

        while (
            excludedDates.some(
                (excludedDate) =>
                    excludedDate.toISOString().split("T")[0] ===
                    nextValidDate.toISOString().split("T")[0]
            )
        ) {
            nextValidDate.setDate(nextValidDate.getDate() + 1);
        }

        console.log(`Default date for room ${nomorKamar}: ${nextValidDate.toISOString().split("T")[0]}`);
        return nextValidDate;
    };

    const normalizeDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    useEffect(() => {
        async function clearExpiredActive() {
            try {
                const today = new Date();
                const expiredActives = active.filter((act) => {
                    const checkoutDate = new Date(act.checkout);
                    return checkoutDate < today;
                });

                for (const expired of expiredActives) {
                    await deleteActive(expired.id);
                    console.log(`Active ID ${expired.id} dihapus dan sudah leaawt boloo.`);
                }
                const refreshedData = await getActives();
                if (refreshedData) {
                    const normalizedData = refreshedData.map((active) => ({
                        ...active,
                        checkin: normalizeDate(active.checkin),
                        checkout: normalizeDate(active.checkout),
                    }));
                    setActive(normalizedData);
                }
            } catch (error) {
                console.error("kedaluwarsa bolo :", error);
            }
        }
        clearExpiredActive();
    }, [active]);

    const startserves = () => {
        setreserves(true)
        setTimeout(() => {

            for (let i = 13; i <= 24; i++) {
                const element = document.querySelector(`.kamar-${i}`);
                if (element) {
                    element.classList.remove(`kamar-${i}`);
                    element.classList.add(`kamar-${i}-hidden`);
                }
            }
        }, 1);
    }

    return (
        <>
            <p></p>
            <button onClick={startserves}>
                Reserve Now !!!
            </button>
            {reserves && (
                <div className="KotakLogin">


                    <div className="IsiKotakLogin">
                        <form className="Submit-Reservasi" >
                            <div className='crls'>
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
                            </div>

                            <div className='Formreservasi'>
                                {/* //Logikaa */}
                                {rooms.map((room) => (
                                    <div id="allkamar" key={room?.NomorKamar} style={{ position: "relative" }} className={`kamar-${room?.NomorKamar}`}>
                                        <div>
                                            <label className='customlabel'>
                                                <input
                                                    type="checkbox"
                                                    className="custom-checkbox"
                                                    value={room?.NomorKamar}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <div className="angkakamar">{room?.NomorKamar}</div>
                                            </label>
                                        </div>

                                        <div
                                            className={`dynamic-content ${selectedRooms.includes(`${room?.NomorKamar}`) ? "visible" : ""
                                                }`}
                                        >
                                            <DatePicker
                                                selected={
                                                    dates[room?.NomorKamar]
                                                        ? new Date(dates[room?.NomorKamar])
                                                        : getDefaultDate(room?.NomorKamar)
                                                }
                                                minDate={new Date()}
                                                excludeDates={getDisabledDatesForRoom(room?.NomorKamar)}
                                                onChange={(date) => handleDateChange(room?.NomorKamar, date)}
                                            />

                                            <input
                                                type="number"
                                                value={spinners[room?.NomorKamar] || 1}
                                                min={1}
                                                max={getMaxSpinner(room?.NomorKamar)}
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
                                        </div>
                                    </div>
                                ))}


                                {/* Logika */}

                            </div>
                            <button className='submitreservation' onClick={submitReservation}>Submit</button>
                            <div></div>

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