import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export interface SummaryDialogProps {
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
}

function OkDialog({ title, content, open, onClose}: SummaryDialogProps) {
    return (
        <Dialog open={open}
        onClose={()=>onClose()}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()} color="primary">Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OkDialog;
