import type { MatchPayload } from "../types/matchesPayload";
import { TeamSection } from "./TeamSection";
import type { MatchCardProps } from "./matchesProps";

const MatchScheduleCard: React.FC<MatchPayload & MatchCardProps> = ({
  team_home,
  team_away,
  match_time,
  time_zone,
  match_date,
  stadium,
  onClick,
}) => {
  return (
    <div className="grid grid-cols-3 grid-rows[auto_1fr]" onClick={onClick}>
      <TeamSection {...team_home} />

      <section className="flex justify-center items-center flex-col bg-gray-600 cursor-pointer">
        <h2 className="text-4xl font-extrabold text-white">{match_time}</h2>
        <h2 className="text-4xl font-extrabold text-white">{time_zone}</h2>
      </section>

      <TeamSection {...team_away} />

      <section className="flex justify-center items-center flex-col row-span-2 col-start-1 col-end-4">
        <h2 className="text-base font-extrabold">{match_date}</h2>
        <p className="text-xs font-normal">{stadium}</p>
      </section>
    </div>
  );
};

export default MatchScheduleCard;
