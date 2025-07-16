import { Box, Snackbar } from "@mui/material";

const SnackBarToast = ({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) => {
  return (
    <div>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={onClose}
          message={message}
        />
      </Box>
    </div>
  );
};

export default SnackBarToast;
