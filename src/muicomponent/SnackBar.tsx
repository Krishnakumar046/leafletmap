import { Box, Snackbar } from "@mui/material";

const SnackBarToast = ({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose?: () => void;
}) => {
  // OPEN MAKES THE SNACKBAR OF THE TOAST MESSAGE TO OPEN
  // MESSAGE IS OF MAKING THE GIVEN MESSAGE TO OPEN
  //
  return (
    <div>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={5000}
          onClose={onClose}
          message={message}
        />
      </Box>
    </div>
  );
};

export default SnackBarToast;
