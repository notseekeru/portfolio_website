import { useEffect, useState } from "react";
import personalData from "../data/personalData";
import { GitHubIcon } from "./icons/Icons";

// Public instance of grubersjoe/github-contributions-api. The portfolio repo is private, so a
// branch of it cannot be fetched anonymously — this reads the public calendar instead. It serves
// a fixed four-year calendar, zero-filled outside its real coverage, so the window is clamped to
// today before slicing.
const SOURCE = "https://github-contributions-api.jogruber.de/v4/notseekeru";
const WINDOW = 365;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HEAT = ["bg-border/60", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const ROW = 18; // h-3.5 (14px) + gap-1 (4px)
const COLS = Math.ceil(WINDOW / 7);
const PENDING = "animate-pulse bg-border/40";

interface Day {
    d: string;
    c: number;
    l: number;
}

export default function GitHubActivity() {
    const [days, setDays] = useState<Day[] | null | undefined>(undefined);

    useEffect(() => {
        fetch(SOURCE)
            .then((r) => (r.ok ? r.json() : null))
            .then((data: { contributions?: { date: string; count: number; level: number }[] } | null) => {
                if (!data?.contributions) return setDays(null);
                const today = new Date().toISOString().slice(0, 10);
                setDays(
                    data.contributions
                        .filter(({ date }) => date <= today)
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(-WINDOW)
                        .map(({ date, count, level }) => ({ d: date, c: count, l: level })),
                );
            })
            .catch(() => setDays(null));
    }, []);

    if (days === null || days?.length === 0) return null;
    const t = days?.reduce((sum, day) => sum + day.c, 0);

    // The window starts mid-week, so the opening column holds fewer days: offset that column
    // instead of padding it, keeping every later column on its true weekday row.
    const short = days ? new Date(days[0].d).getUTCDay() : 0;
    const weeks: Day[][] = [];
    if (days) for (let i = -short; i < days.length; i += 7) weeks.push(days.slice(Math.max(i, 0), i + 7));

    const month = (day: string) => new Date(day).getUTCMonth();

    // While the fetch is in flight the same COLS×7 grid is reserved with level -1 placeholders,
    // so the section settles into shape instead of appearing whole.
    const cols: { key: string; label?: string; cells: Day[] }[] = days
        ? weeks.map((week, i) => ({ key: week[0].d, label: month(week[0].d) !== month(weeks[Math.max(i - 1, 0)][0].d) ? MONTHS[month(week[0].d)] : undefined, cells: week }))
        : Array.from({ length: COLS }, (_, i) => ({ key: `s${i}`, cells: Array.from({ length: 7 }, (_, j) => ({ d: `s${i}-${j}`, c: -1, l: -1 })) }));

    return (
        <div className="mt-16 border-t border-border pt-8">
            <div className="overflow-x-auto pb-1">
                <div className="mx-auto w-fit">
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                        <span className="font-mono text-sm tracking-widest text-muted">GITHUB ACTIVITY</span>
                        <a href={personalData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent">
                            <GitHubIcon size={16} /> {t ?? <span className={`inline-block h-3 w-6 align-middle ${PENDING}`} />} contributions · last year
                        </a>
                    </div>

                    <div className="flex gap-1">
                        {cols.map((col) => (
                            <div key={col.key} className="w-3.5 shrink-0">
                                {col.label && <span className="font-mono text-[11px] whitespace-nowrap text-muted">{col.label}</span>}
                            </div>
                        ))}
                    </div>

                    <div className="mt-1 flex gap-1" role="img" aria-busy={!days} aria-label={days ? `GitHub contribution calendar: ${t} contributions in the last year` : "GitHub contribution calendar: loading"}>
                        {cols.map((col, i) => (
                            <div key={col.key} style={i === 0 && short ? { marginTop: short * ROW } : undefined} className="flex w-3.5 shrink-0 flex-col gap-1">
                                {col.cells.map((day) => (
                                    <span key={day.d} title={day.c < 0 ? undefined : `${day.c} contribution${day.c === 1 ? "" : "s"} on ${day.d}`} className={`h-3.5 w-3.5 ${day.l < 0 ? PENDING : (HEAT[day.l] ?? HEAT[0])}`} />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 font-mono text-xs text-muted">
                        Less
                        {HEAT.map((shade) => (
                            <span key={shade} className={`h-3.5 w-3.5 ${shade}`} />
                        ))}
                        More
                    </div>
                </div>
            </div>
        </div>
    );
}
