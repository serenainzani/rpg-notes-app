import { Button } from "@mui/material";

interface AuthButtonProps {
    onClick: () => void;
    message: string;
}

export default function AuthButton({ onClick, message }: AuthButtonProps) {
    return (
        <div className="flex justify-center mt-4">
            <Button variant="contained" color="secondary" onClick={onClick}>
                {message}
            </Button>
        </div>
    );
}
