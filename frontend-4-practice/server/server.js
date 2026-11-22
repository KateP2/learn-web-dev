import { database } from "./database.js";

const DELAY_MS = 500;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendJson(res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end(JSON.stringify(data));
}

function isSameDate(day, month, year, date) {
    return (
        day === date.getDate() &&
        month === date.getMonth() &&
        year === date.getFullYear()
    );
}

export default function apiMiddleware() {
    return {
        name: "api-middleware",

        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith("/api/")) {
                    return next();
                }

                if (req.method === "OPTIONS") {
                    res.statusCode = 204;
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                    res.end();
                    return;
                }

                const url = new URL(req.url, "http://localhost");

                if (req.method === "GET" && url.pathname === "/api/booking/today") {
                    await delay(DELAY_MS);
                    return sendJson(res, 200, database.today);
                }

                if (req.method === "GET" && url.pathname === "/api/slots") {
                    await delay(DELAY_MS);

                    const dayValue = url.searchParams.get("day");
                    const monthValue = url.searchParams.get("month");
                    const yearValue = url.searchParams.get("year");

                    if (dayValue === null || monthValue === null || yearValue === null) {
                        return sendJson(res, 400, {
                            error: "Необходимо указать day, month и year"
                        });
                    }

                    const day = Number(dayValue);
                    const month = Number(monthValue);
                    const year = Number(yearValue);

                    const actualDate = new Date(year, month, day);

                    if (
                        !Number.isInteger(day) ||
                        !Number.isInteger(month) ||
                        !Number.isInteger(year) ||
                        actualDate.getDate() !== day ||
                        actualDate.getMonth() !== month ||
                        actualDate.getFullYear() !== year
                    ) {
                        return sendJson(res, 400, {
                            error: "Указана некорректная дата"
                        });
                    }

                    const noSlotsDate = new Date(
                        database.today.year,
                        database.today.month,
                        database.today.day + 3
                    );

                    const errorDate = new Date(
                        database.today.year,
                        database.today.month,
                        database.today.day + 4
                    );

                    if (isSameDate(day, month, year, errorDate)) {
                        return sendJson(res, 500, {
                            error: "Не удалось получить расписание. Попробуйте выбрать другую дату."
                        });
                    }

                    const slots = isSameDate(day, month, year, noSlotsDate)
                        ? []
                        : day % 2 === 0
                            ? database.slotsEvenDay
                            : database.slotsOddDay;

                    return sendJson(res, 200, {
                        date: { day, month, year },
                        slots
                    });
                }

                return sendJson(res, 404, {
                    error: "Запрошенный адрес не найден"
                });
            });
        }
    };
}
