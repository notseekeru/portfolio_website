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

interface Day {
    d: string;
    c: number;
    l: number;
}

export default function GitHubActivity() {
    const [days, setDays] = useState<Day[] | null>(null);

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

    if (!days?.length) return null;
    const t = days.reduce((sum, day) => sum + day.c, 0);

    // The window starts mid-week, so the opening column holds fewer days: offset that column
    // instead of padding it, keeping every later column on its true weekday row.
    const short = new Date(days[0].d).getUTCDay();
    const weeks: Day[][] = [];
    for (let i = -short; i < days.length; i += 7) weeks.push(days.slice(Math.max(i, 0), i + 7));

    const month = (day: string) => new Date(day).getUTCMonth();

    return (
        <div className="mt-16 border-t border-border pt-8">
            <div className="overflow-x-auto pb-1">
                <div className="mx-auto w-fit">
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                        <span className="font-mono text-sm tracking-widest text-muted">GITHUB ACTIVITY</span>
                        <a href={personalData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent">
                            <GitHubIcon size={16} /> {t} contributions · last year
                        </a>
                    </div>

                    <div className="flex gap-1">
                        {weeks.map((week, i) => (
                            <div key={week[0].d} className="w-3.5 shrink-0">
                                {month(week[0].d) !== month(weeks[Math.max(i - 1, 0)][0].d) && <span className="font-mono text-[11px] whitespace-nowrap text-muted">{MONTHS[month(week[0].d)]}</span>}
                            </div>
                        ))}
                    </div>

                    <div className="mt-1 flex gap-1" role="img" aria-label={`GitHub contribution calendar: ${t} contributions in the last year`}>
                        {weeks.map((week, i) => (
                            <div key={week[0].d} style={i === 0 ? { marginTop: short * ROW } : undefined} className="flex w-3.5 shrink-0 flex-col gap-1">
                                {week.map((day) => (
                                    <span key={day.d} title={`${day.c} contribution${day.c === 1 ? "" : "s"} on ${day.d}`} className={`h-3.5 w-3.5 ${HEAT[day.l] ?? HEAT[0]}`} />
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
