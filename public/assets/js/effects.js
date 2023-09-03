function random_color() {
    const colors = ["red", "orange", "green", "blue", "purple", "pink", "black", "maroon", "brown", "navy", "teal", "olive", "lime", "aqua", "silver", "gray"];
    return colors[Math.floor(Math.random() * colors.length)];     // return a random color from the colors array
    // math.random return random num from 0-1 multiplied by colors.length to get a random num from 0 to colors.length,
    // then math.floor rounds the value
}
const message_input = document.getElementById("message"); // get the message input
if (message_input === null) {
    console.error("message input is null");
}
export function rainbow() {
    if(message_input.innerHTML !== null) { // if user has typed anything
        for (let i = 0; i < message_input.placeholder.length; i++) {
            message_input.style.color = random_color();
        }
        setTimeout(rainbow, 500);

    }
    else{
        setTimeout(rainbow, 500);
    }


}
