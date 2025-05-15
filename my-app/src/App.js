import { useState, useEffect, useReducer } from "react";

const carTypes = ["Sedan", "SUV", "Truck"];
const repairServices = ["Oil Change", "Brake Check", "Engine Diagnostics"];

const mockStations = [
  {
    id: 1,
    name: "QuickFix Auto",
    services: ["Oil Change", "Brake Check"],
    carTypes: ["Sedan", "SUV"],
    slots: ["9:00 AM", "11:00 AM", "1:00 PM"]
  },
  {
    id: 2,
    name: "AutoPro",
    services: ["Engine Diagnostics", "Oil Change"],
    carTypes: ["SUV", "Truck"],
    slots: ["10:00 AM", "12:00 PM"]
  }
];

const initialState = {
  carType: "",
  service: "",
  selectedStation: null,
  selectedSlot: "",
  bookingSuccess: false
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CAR_TYPE":
      return { ...state, carType: action.payload, selectedStation: null, selectedSlot: "", bookingSuccess: false };
    case "SET_SERVICE":
      return { ...state, service: action.payload, selectedStation: null, selectedSlot: "", bookingSuccess: false };
    case "SELECT_SLOT":
      return { ...state, selectedSlot: action.payload };
    case "SELECT_STATION":
      return { ...state, selectedStation: action.payload, selectedSlot: "" };
    case "BOOK":
      return { ...state, bookingSuccess: true };
    case "CLOSE_POPUP":
      return { ...state, bookingSuccess: false };
    default:
      return state;
  }
}

export default function BookingApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (state.carType && state.service) {
      setLoading(true);
      setTimeout(() => {
        const stations = mockStations.filter(
          (station) =>
            station.services.includes(state.service) &&
            station.carTypes.includes(state.carType)
        );
        setFilteredStations(stations);
        setLoading(false);
      }, 1000);
    } else {
      setFilteredStations([]);
    }
  }, [state.carType, state.service]);

  useEffect(() => {
    if (state.bookingSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [state.bookingSuccess]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="header">
        <h1>Smart Booking</h1>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>

      <div className="form-grid">
        <div>
          <label>Select Car Type</label>
          <select
            value={state.carType}
            onChange={(e) => dispatch({ type: "SET_CAR_TYPE", payload: e.target.value })}
          >
            <option value="">-- Choose Car Type --</option>
            {carTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Repair Service</label>
          <select
            value={state.service}
            onChange={(e) => dispatch({ type: "SET_SERVICE", payload: e.target.value })}
          >
            <option value="">-- Choose Service --</option>
            {repairServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading stations...</p>
      ) : filteredStations.length === 0 && state.carType && state.service ? (
        <p>No stations found for selected criteria.</p>
      ) : (
        filteredStations.map((station) => (
          <div key={station.id} className="station-card">
            <div className="card">
              <h2>{station.name}</h2>
              <div className="slots">
                {station.slots.map((slot) => (
                  <button
                    key={slot}
                    className={
                      state.selectedSlot === slot && state.selectedStation?.id === station.id
                        ? "slot-button active"
                        : "slot-button"
                    }
                    onClick={() => {
                      dispatch({ type: "SELECT_STATION", payload: station });
                      dispatch({ type: "SELECT_SLOT", payload: slot });
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      {state.selectedSlot && state.selectedStation && !state.bookingSuccess && (
        <div className="book-btn-container">
          <button className="book-btn" onClick={() => dispatch({ type: "BOOK" })}>Book Now</button>
        </div>
      )}

      {state.bookingSuccess && (
        <div className="modal fade-in">
          <div className="modal-content">
            <span className="close" onClick={() => dispatch({ type: "CLOSE_POPUP" })}>&times;</span>
            <p>
              Booking successful for <strong>{state.carType}</strong> at <strong>{state.selectedStation.name}</strong> at <strong>{state.selectedSlot}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
