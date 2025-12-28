import { Navigate, useNavigation } from "react-router-dom";

export default function LoginNavigate() {
    const navigation=useNavigation()
    Navigate(-1)
}
