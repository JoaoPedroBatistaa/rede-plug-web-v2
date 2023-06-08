import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextProps {
  openMenu: boolean;
  setOpenMenu: (isOpen: boolean) => void;
}

const MenuContext = createContext<MenuContextProps>({
  openMenu: false,
  setOpenMenu: () => {},
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <MenuContext.Provider value={{ openMenu, setOpenMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
