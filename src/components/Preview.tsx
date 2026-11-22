import { useState } from "react";
import Alerts from "./Alerts";

const Preview = () => {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setShowAlert(true)}
        className="bg-amber-400 p-6 cursor-pointer"
      >
        tes
      </button>

      {showAlert && (
        <Alerts
          variant="danger"
          desc="password atau email salah"
          duration={5000}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Preview;
