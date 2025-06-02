import { debounce } from "lodash";

export const debounceRender = debounce((callback: () => void) => {
    console.log("debounce");
    callback();
}, 500);