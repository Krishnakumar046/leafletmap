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
  console.log(
    `open${open}, message ${message}, onclose ${onclose}, "snackbartosat`
  );
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
