import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
  const button = (
    <button
      type="button"
      className="header__button button button_blue"
      onClick={() => props.openRedactor('new', {})}
    >
      Создать встречу
    </button>
  );

  return (
    <header className="header">
      <a className="header__logo-link" href="https://yandex.ru/">
        <img className="header__logo-img" src="./assets/logo.svg" alt="Яндекс" />
      </a>
      { props.activeSection === 'table' ? button : null }
    </header>
  );
}

Header.propTypes = {
  activeSection: PropTypes.string.isRequired,
  openRedactor: PropTypes.func.isRequired,
};

export default Header;
