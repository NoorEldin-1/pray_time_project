import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./App.css";
function App() {
  const [select, setSelect] = useState("Mecca");
  const [time, setTime] = useState({});

  const getTiming = async () => {
    const data = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${select}`
    );
    setTime(data.data.data.timings);
  };
  useEffect(() => {
    getTiming();
  }, [select]);
  return (
    <div className="App">
      <Header />
      <Selects />
      <Cards />
    </div>
  );
  function Header() {
    const [date, setDate] = useState(
      moment().format("MMMM Do YYYY, h:mm:ss a")
    );
    const [duration, setDuration] = useState("00:00:00");
    const [nextPrayer, setNextPrayer] = useState("");
    function subtractTime() {
      function calcDuration(x) {
        const duration = moment.duration(moment(`${x}`, "h:mm").diff(moment()));
        const hours = `0${duration.hours()}`.slice(-2);
        const minutes = `0${duration.minutes()}`.slice(-2);
        const seconds = `0${duration.seconds()}`.slice(-2);
        const finalTime = `${hours}:${minutes}:${seconds}`;
        setDuration(finalTime);
      }
      if (moment(`${time.Fajr}`, "h:mm").isAfter(moment())) {
        calcDuration(time.Fajr);
        setNextPrayer("Fajr");
      } else if (moment(`${time.Dhuhr}`, "h:mm").isAfter(moment())) {
        calcDuration(time.Dhuhr);
        setNextPrayer("Dhuhr");
      } else if (moment(`${time.Asr}`, "h:mm").isAfter(moment())) {
        calcDuration(time.Asr);
        setNextPrayer("Asr");
      } else if (moment(`${time.Maghrib}`, "h:mm").isAfter(moment())) {
        calcDuration(time.Maghrib);
        setNextPrayer("Maghrib");
      } else if (moment(`${time.Isha}`, "h:mm").isAfter(moment())) {
        calcDuration(time.Isha);
        setNextPrayer("Isha");
      }
    }
    useEffect(() => {
      const timeInteval = setInterval(() => {
        subtractTime();
      }, 1);
      return () => clearInterval(timeInteval);
    }, []);
    useEffect(() => {
      const timeInteval = setInterval(() => {
        setDate(moment().format("MMMM Do YYYY, h:mm:ss a"));
      }, 1);
      return () => clearInterval(timeInteval);
    }, []);
    return (
      <div className="header">
        <div>
          <p>Time left until {nextPrayer} prayer</p>
          <p>{duration}</p>
        </div>
        <div>
          <p>{date}</p>
          <p>{select}</p>
        </div>
      </div>
    );
  }
  function Cards() {
    const cards = [
      { title: "Fajr", time: time.Fajr },
      { title: "Dhuhr", time: time.Dhuhr },
      { title: "Asr", time: time.Asr },
      { title: "Maghrib", time: time.Maghrib },
      { title: "Isha", time: time.Isha },
    ].map((card, index) => {
      return (
        <div key={index}>
          <img src="./src/assets/nega-YdyhHbWZ1V0-unsplash.jpg" />
          <p>{`${card.title} Prayer`}</p>
          <p>{card.time}</p>
        </div>
      );
    });
    return <div className="cards">{cards}</div>;
  }
  function Selects() {
    return (
      <div className="selects">
        <select value={select} onChange={(e) => setSelect(e.target.value)}>
          <option value={"Mecca"}>Mecca</option>
          <option value={"Medina"}>Medina</option>
          <option value={"Riyadh"}>Riyadh</option>
        </select>
      </div>
    );
  }
}

export default App;
