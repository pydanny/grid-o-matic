import NavBar from "./navbar";

const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
};

const contentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column"
};

const Layout = props => (
    <div className="Layout" style={layoutStyle}>
        <NavBar />
        <div className="Content container mx-auto p-6">
            {props.children}
        </div>
    </div>
);

export default Layout;