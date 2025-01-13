import { useMediaQuery } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return keys.reduce((output, key) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.only(key), { noSsr: true });
        return matches ? key : output;
    }, "lg");
}

export default useWidth;

export const isWidthDown = (breakpoint: any, screenWidth: any) => {
    const BREAK_POINTS = ["xs", "sm", "md", "lg", "xl"];
    const breakpointIndex = BREAK_POINTS.indexOf(breakpoint);
    const screenWidthIndex = BREAK_POINTS.indexOf(screenWidth);
    if (screenWidthIndex === -1 || breakpointIndex === -1) return false;
    return breakpointIndex >= screenWidthIndex;
};
export const isWidthUp = (breakpoint: any, screenWidth: any) => {
    const BREAK_POINTS = ["xs", "sm", "md", "lg", "xl"];
    const breakpointIndex = BREAK_POINTS.indexOf(breakpoint);
    const screenWidthIndex = BREAK_POINTS.indexOf(screenWidth);
    if (screenWidthIndex === -1 || breakpointIndex === -1) return false;
    return breakpointIndex <= screenWidthIndex;
};
