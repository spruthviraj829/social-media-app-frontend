import { createSlice } from "@reduxjs/toolkit";

const defaultTheme = "dark"; // Set the default theme value

const storedTheme = window.localStorage.getItem("theme");
let initialTheme;

try {
    initialTheme = JSON.parse(storedTheme) || defaultTheme; // Parse the stored value, fallback to default if not found or parsing fails
} catch (error) {
    console.error("Error parsing theme from local storage:", error);
    initialTheme = defaultTheme; // Fallback to default theme in case of parsing error
}



const initialState = {
    theme: initialTheme,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            window.localStorage.setItem("theme", JSON.stringify(action.payload));
        },
    },
});

export default themeSlice.reducer;

export function setTheme(value) {
    return (dispatch) => {
        dispatch(themeSlice.actions.setTheme(value));
    };
}
