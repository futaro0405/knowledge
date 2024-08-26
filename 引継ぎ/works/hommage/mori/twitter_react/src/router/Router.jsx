import { Route, Routes } from 'react-router-dom';
import { TweetRoutes } from './TweetRoutes';

export const Router = () => {
    return (
        <Routes>
            {TweetRoutes.map(route => {
                return (<Route key={route.path} exact={route.exact} path={route.path} element={route.children} />)
            })}
        </Routes>
    );
}