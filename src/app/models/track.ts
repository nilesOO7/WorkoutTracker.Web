import { ChartData } from "./chartData";

export class Track {
    workoutTimeOfDay: number;
    workoutTimeOfWeek: number;
    workoutTimeOfMonth: number;

    weekTotalCaloriesBurnt: number;
    monthTotalCaloriesBurnt: number;
    yearTotalCaloriesBurnt: number;

    dayWiseCaloryBurnData: ChartData[];
    weekWiseCaloryBurnData: ChartData[];
    monthWiseCaloryBurnData: ChartData[];

    relativeTimestamp: string;
}
