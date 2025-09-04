import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
	return (
		<div>
			<ToastContainer position="top-center" autoClose={1000} style={{ maxWidth: "100%", marginTop: "10px" }} />
		</div>
	);
};

export default Notification;
