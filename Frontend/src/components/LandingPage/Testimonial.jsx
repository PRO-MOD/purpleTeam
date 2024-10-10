import React, { useState, useEffect } from 'react';

const testimonialsData = [
    {
        quote: "As a part-time bug bounty hunter, I would like to thank Breachpoint for allowing me the chance to report vulnerabilities in private programs. It helps me make money as well as develop different attack methods, which allows me to think outside the box.",
        author: "Ronit Bhatt",
        title: "Security Consultant at KPMG"
    },
    {
        quote: "Bug bounty hunting is what I do. Since there was no platform in India, I always wanted Indian businesses to host their bug bounty program; therefore, my experience with Breachpoint has been fantastic. That breaching point has begun makes me so happy.",
        author: "Pranav Bhandari",
        title: "Media.net"
    },
    {
        quote: "As a bug bounty hunter, I'm grateful to Breachpoint for giving me the opportunity to report vulnerabilities in private programs. Not only does it help me make money, but it also allows me to develop my skills as I am learning something new every time.",
        author: "Aayesha Khan",
        title: "Security Researcher"
    }
];

const Testimonials = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [slideDirection, setSlideDirection] = useState('');

    // Effect to autoplay the testimonials every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentTestimonial]);

    const showTestimonial = (index) => {
        setCurrentTestimonial(index);
    };

    const prevTestimonial = () => {
        setSlideDirection('prev');
        const newIndex = (currentTestimonial - 1 + testimonialsData.length) % testimonialsData.length;
        showTestimonial(newIndex);
    };

    const nextTestimonial = () => {
        setSlideDirection('next');
        const newIndex = (currentTestimonial + 1) % testimonialsData.length;
        showTestimonial(newIndex);
    };

    return (
        <div className="relative flex flex-col justify-center items-center w-full bg-gray-100 p-4 lg:p-10">
            <button 
                onClick={prevTestimonial} 
                className="absolute left-4 text-gray-500 text-2xl" 
                aria-label="Previous testimonial"
            >
                &lt;
            </button>
            <div className="flex justify-center w-full overflow-hidden">
                {testimonialsData.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`transition-transform duration-500 ease-in-out flex-shrink-0 w-full lg:w-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-lg mx-2 mb-4 lg:mb-0
                            ${currentTestimonial === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
                            ${slideDirection === 'prev' && currentTestimonial !== index ? 'translate-x-[-100%]' : ''}
                            ${slideDirection === 'next' && currentTestimonial !== index ? 'translate-x-full' : ''}`}
                        style={{ display: currentTestimonial === index ? 'block' : 'none' }}
                    >
                        <blockquote className="quote text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                        <footer className="author text-right">
                            <cite className="name font-bold">{testimonial.author}</cite>
                            <div className="title text-sm">{testimonial.title}</div>
                        </footer>
                    </div>
                ))}
            </div>
            <button 
                onClick={nextTestimonial} 
                className="absolute right-4 text-gray-500 text-2xl" 
                aria-label="Next testimonial"
            >
                &gt;
            </button>
        </div>
    );
};

export default Testimonials;
