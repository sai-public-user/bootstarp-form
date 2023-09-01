import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface CustomModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

function CustomModal(props: CustomModalProps) {
  const [show, setShow] = useState(props.show);
  const handleClose = () => {
    setShow(false);
    if (props.onClose) props.onClose();
  };
  const handleSave = () => {
    setShow(false);
    if (props.onSave) props.onSave();
  };
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
