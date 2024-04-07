import { useLocation, useNavigate } from "react-router-dom";

function History() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const history = state.history;

    return (
        <div className="total-content">
            <h1> Activities </h1>
            <div className="box">
                <table>
                    <tr>
                        <th> Date </th>
                        <th> Calorie Burnt </th>
                        <th> Sleep Duration </th>
                    </tr>
                    {history.map((item) => {
                        const dateTime = String(item.date);
                        const date = dateTime.split("T");

                        const sleepDuration = Math.round(item.sleepDurationMinutes);
                        const sleepDurationHr = Math.floor(sleepDuration / 60);
                        const sleepDurationMin = sleepDuration % 60;

                        return <tr>
                            <td> {date[0]} </td>
                            <td> {item.calorieBurnt} </td>
                            <td> {sleepDurationHr} hr {sleepDurationMin} mins </td>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    )
}

export default History