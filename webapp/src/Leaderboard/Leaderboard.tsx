import classes from "./Leaderboard.module.css"
import {FC, useEffect, useState} from "react";
import {httpApi} from "../httpApi.ts";
import {ILeaderboardRow} from "../types.ts";
import {clsx} from "clsx";
import {Skeleton} from "antd";
import {ESortDirection} from "../Models/ESortDirection.ts";
import {sortByKey} from "../Utils/SortByKey.ts";

interface IHeadTitle {
    title: string
    sortKey?: keyof ILeaderboardRow
}

const HEAD_TITLES: IHeadTitle[] = [
    {title: "#"},
    {title: "Name", sortKey: "name"},
    {title: "G", sortKey: "score"},
    {title: "W/R", sortKey: "winRate"}
]

const Row: FC<ILeaderboardRow> = ({place, name, score, winRate}) => {
    return <div className={classes.row}>
        <span>{place}</span>
        <span>{name}</span>
        <span>{score}</span>
        <span>{`${winRate}%`}</span>
    </div>
}

const Leaderboard = () => {
    const [rows, setRows] = useState<ILeaderboardRow[]>([])
    const [sortDirection, setSortDirection] = useState(ESortDirection.asc)

    useEffect(() => {
        httpApi.getLeaderboardRows().then(setRows)
    }, []);

    const onHeadClickHandler = (sortKey: keyof ILeaderboardRow) => {
        return () => {
            setSortDirection((it) => it === ESortDirection.asc ? ESortDirection.desc : ESortDirection.asc)
            setRows(sortByKey(rows, sortKey, sortDirection))
        }
    }

    return <div className={classes.leaderboard}>
        <div className={clsx(classes.row, classes.head)}>
            {HEAD_TITLES.map(({title, sortKey}) =>
                <span onClick={sortKey ? onHeadClickHandler(sortKey) : undefined}
                      key={title}>{title}</span>)}
        </div>

        <div className={classes.body}>
            {rows.length === 0 ? <Skeleton style={{padding: 20}}/> : rows.map((row) => <Row {...row} key={row.name}/>)}
        </div>
    </div>
}

export {Leaderboard}
