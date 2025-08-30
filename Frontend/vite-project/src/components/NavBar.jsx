import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { CgArrowRight } from "react-icons/cg";
import Profile from "./Profile";
import Swal from "sweetalert2";

function NavBar(props) {
  const navigate = useNavigate();
  const { user } = useUser();

  function loginHandler() {
    props.setModals(prev => ({ ...prev, login: true }));
  }
  function signupHandler() {
    props.setModals(prev => ({ ...prev, signup: true }));
  }
  const handleShow = () => {
    if(user && user.id){
      props.setModals(modals => ({ ...modals, postAdv: true }))}
    
    else{
      Swal.fire({
        title:"Please Login First",
        icon:"error",
        timer:1000,
        timerProgressBar:true,
        showCloseButton:false,
        showConfirmButton:false
      })
    }
  }
  return (
    <>
      <div>
        {(user && user.id) ? (
          <Profile user={user} />
        ) : (
          <div className="text-end px-3 pt-1">
            <button className="btn btn-green" onClick={loginHandler}>Login</button>
            <button className="btn btn-green ms-2" onClick={signupHandler}>Signup</button>
          </div>
        )}
      </div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/" className="text-green fs-3 fw-bold animate__animated animate__wobble">PakClassified</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse >
            <Nav className="ms-auto my-2 my-lg-0 nav" navbarScroll>
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
              <Nav.Link onClick={()=>navigate("/about")}>About</Nav.Link>
              {/* <Nav.Link onClick={()=>navigate("/chat")} className="animate__animated animate__backInLeft">Help</Nav.Link> */}
              <NavDropdown title="Categories" id="navbarScrollingDropdown" style={{position:"relative"}} >
                <NavDropdown.Item onClick={() => navigate("/categories")} style={{position:"absoulte", zIndex:100}} >All Categories</NavDropdown.Item>
                {props.carCategories?.map(category => (
                  <NavDropdown.Item 
                    key={category.title} 
                    onClick={() => navigate(`/category/${category.title}`)}
                  >
                    {category.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link onClick={()=>navigate("/contact")}>Contact</Nav.Link>
              <button className="btn-green" onClick={handleShow} >
                Post Advertisement  <CgArrowRight size={20} />
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
export default NavBar;
