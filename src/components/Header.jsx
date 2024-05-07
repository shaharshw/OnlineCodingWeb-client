import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';



export default function Header() {

    return (
        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <Link className="navbar-brand ms-2" to="/lobby">
                            <div className="fs-2 fw-bold text-black title">
                                Coding App
                            </div>
                        </Link>

                    </nav>
                </div>
            </div>
        </header>
    );
}


