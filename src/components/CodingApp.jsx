import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlock from './CodeBlock';
import Footer from './Footer'
import Header from './Header';
import ErrorComponent from './ErrorComponent';


export default function CodingApp() {
    return (
        <div className='CodingApp'>

            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={ <Lobby /> }></Route>
                    <Route path='/lobby' element={ <Lobby /> }></Route>
                    <Route path='/codeblock/:' element={ <CodeBlock /> }></Route>
                    <Route path='*' element={ <ErrorComponent /> }></Route>
                </Routes>
                <Footer />
            </BrowserRouter>

        </div>
    );
}