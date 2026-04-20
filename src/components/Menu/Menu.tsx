import { NavLink } from 'react-router-dom';

import { route } from '@/router/index.tsx';
import type { RouteItem } from '@/router/index.ts';
import menu from './Menu.module.css';

function setCurrNav({ isActive }: { isActive: boolean }) {
  return isActive ? menu.active : '';
}
function Menu() {
  const menuList = route.map((item: RouteItem) => {
    if (!item.text) {
      return null;
    }
    return (
      <NavLink to={item.path} key={item.path} className={setCurrNav}>
        {item.text}
      </NavLink>
    );
  });
  return (
    <>
      <nav className={menu.menu}>{menuList}</nav>
    </>
  );
}
export default Menu;
