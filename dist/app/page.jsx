import Login from "@/Component/Login";
import styles from "./page.module.css";
import { Stack } from "@mui/material";
export default function Home() {
    return (<Stack height={"100%"}>
      <Stack flexGrow={1} component={"main"}>
        <Login />
      </Stack>
      <footer className={styles.footer}>
            f
      </footer>
    </Stack>);
}
