import DatePicker from "react-datepicker";
import React, { useState } from 'react'; // Pastikan useState diimpor

export function Profile() {
    const [selectedDate, setSelectedDate] = useState();
    const disabledDate = new Date(2025, 0, 5); // 5 Januari 2025

    return (
        <>
            <div>
                <h1>Pilih Tanggal</h1>
                <DatePicker
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileDisabled={({ date }) => date.toDateString() === disabledDate.toDateString()}
                />
                {selectedDate && <p>Tanggal yang dipilih: {selectedDate.toDateString()}</p>}
            </div>
        </>
    )
}