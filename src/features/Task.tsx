import { Link, useParams } from "react-router"

export const Task = () => {

    const { tasksId } = useParams()

    return (
        <>
            <h1>this is Task with id = {tasksId}</h1>
            <Link to='/'> Home </Link>
        </>
    )
}