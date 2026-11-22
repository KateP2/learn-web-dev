const currentDate = new Date();

export const database = {
    today: {
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
    },

    slotsEvenDay: [
        { time: "10:00", available: true },
        { time: "11:30", available: true },
        { time: "13:00", available: false },
        { time: "15:30", available: true },
        { time: "17:00", available: true },
        { time: "18:30", available: false }
    ],

    slotsOddDay: [
        { time: "10:00", available: true },
        { time: "11:30", available: false },
        { time: "13:00", available: true },
        { time: "15:30", available: true },
        { time: "17:00", available: false },
        { time: "18:30", available: false }
    ]
};
