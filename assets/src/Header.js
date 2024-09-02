function Header() {
const linkStyle = {padding: 30};

    return (
        <div className="App-header">
          <div style={{ padding: 10}}>
            <a href="https://github.com/alanmanderson" style={ linkStyle }>Github</a>
            <a href="https://www.credly.com/users/alanmanderson" style={ linkStyle }>Credly</a>
            <a href="https://linkedin.com/alan" style={ linkStyle }>LinkedIn</a>
            <a href="https://stackoverflow.com/users/1068058/alanmanderson" style= { linkStyle }>StackOverflow</a>
            <a href="https://www.upwork.com/freelancers/~018e043a618fdfb9d9" style={ linkStyle }>Upwork</a>
          </div>
        </div>
    );
}

export default Header;
