import React from 'react'

// STYLES
import '../styles/quote.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'


function Quotes() {

    const motivationalQuotes = [
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "Believe you can and you're halfway there.",
        "Your limitation—it’s only your imagination.",
        "Hardships often prepare ordinary people for an extraordinary destiny.",
        "Don’t wait for opportunity. Create it.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn’t just find you. You have to go out and get it.",
        "The key to success is to focus on goals, not obstacles.",
        "Don’t stop when you’re tired. Stop when you’re done.",
        "It always seems impossible until it’s done.",
        "Wake up with determination. Go to bed with satisfaction.",
        "Do something today that your future self will thank you for.",
        "Little things make big days.",
        "The only limit to our realization of tomorrow is our doubts of today.",
        "Push yourself, because no one else is going to do it for you.",
        "Opportunities don’t happen, you create them.",
        "Sometimes later becomes never. Do it now.",
        "Success is what happens after you have survived all your mistakes.",
        "You don’t have to be great to start, but you have to start to be great."
    ];

    const randomQuote = () => {
        let randNum = Math.floor(Math.random() * 20);
        return motivationalQuotes[randNum]
    }



    return (
        <div className='comp-quote '>
            <h5 className='inter-bold'>Quote of the day</h5>
            <div className="quote-container">
                <h3 className='inter-regular'>{randomQuote()}</h3>
            </div>
        </div>
    )
}

export default Quotes
