import { Dropdown } from 'react-bootstrap';

export interface MenuPorps {
    id?: string;
    children: React.ReactElement;
    trigger: string | React.ReactElement;
    className?: string;
}

export default function Menu({ id = '', children = null, trigger = null, className= '' }) {
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id={`menu-id-${id}`} as="div" className={`${className} menu-toggle`}>
          {trigger}
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-2">
        {children}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
