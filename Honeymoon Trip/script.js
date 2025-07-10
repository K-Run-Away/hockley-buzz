document.addEventListener('DOMContentLoaded', function() {
    const startDate = new Date('2025-05-24');
    const endDate = new Date('2025-06-09');
    const calendar = document.getElementById('calendar');

    // Trip data
    const tripData = {
        '2025-05-24': {
            hotel: 'Singapore hotel *',
            activity: 'Dinner and chill',
            travel: 'Arrive 16:05'
        },
        '2025-05-25': {
            hotel: 'Ubud hotel *',
            activity: 'Marina Bay',
            travel: 'Flight to Bali * Travel to Ubud *\nFlight: ID7134 (Batik Air)\nSIN-DPS 16:15-19:05\nBooking: 1653705182178224'
        },
        '2025-05-26': {
            hotel: 'Ubud hotel',
            activity: 'Explore Ubud and Spa',
            travel: '—'
        },
        '2025-05-27': {
            hotel: 'Ubud hotel',
            activity: 'Northern Temples and Waterfalls',
            travel: 'Private driver *'
        },
        '2025-05-28': {
            hotel: 'Ubud hotel',
            activity: 'Campuhan ridge walk and Rice terrace and Bali swing',
            travel: 'Private driver *'
        },
        '2025-05-29': {
            hotel: 'Uluwatu hotel *',
            activity: 'Mount Batur trek',
            travel: 'Travel to Uluwatu * 2hrs'
        },
        '2025-05-30': {
            hotel: 'Uluwatu hotel',
            activity: 'Seminyak shopping and vibes',
            travel: 'Private driver *'
        },
        '2025-05-31': {
            hotel: 'Uluwatu hotel',
            activity: 'Nusa Penida island',
            travel: 'Tour *'
        },
        '2025-06-01': {
            hotel: 'Uluwatu hotel',
            activity: 'Uluwatu temple and beaches',
            travel: 'Private driver *'
        },
        '2025-06-02': {
            hotel: 'Cat Ba hotel *',
            activity: '',
            travel: 'Flight to Hanoi * Travel to Cat Ba Islands 4hrs'
        },
        '2025-06-03': {
            hotel: 'Cat Ba hotel',
            activity: 'Cat Ba Islands and Lan Ha Bay',
            travel: 'Flights:\nVJ898 (VietJet Air)\nDPS-SGN 15:30-18:20\nVJ1644 (VietJet Air)\nSGN-DAD 21:25-22:50\nBooking: 1653705182252208'
        },
        '2025-06-04': {
            hotel: 'Ninh Binh *',
            activity: 'Ninh Binh',
            travel: 'Drive to Ninh Binh * 4-5hrs'
        },
        '2025-06-05': {
            hotel: 'Hoi An',
            activity: 'Lantern show',
            travel: 'Drive to Hanoi *3 hours then Fly to Da Lang * for Hoi An'
        },
        '2025-06-06': {
            hotel: 'Hoi An',
            activity: 'Hoi An - basket boat thing',
            travel: ''
        },
        '2025-06-07': {
            hotel: 'Kuala Lumpur hotel *',
            activity: '',
            travel: 'Flight to Kuala Lumpur from Da Lang *'
        },
        '2025-06-08': {
            hotel: 'Kuala Lumpur hotel',
            activity: 'Chill',
            travel: 'Flight: AK649 (AirAsia)\nDAD-KUL 12:35-16:25\nBooking: 1653705182396784'
        },
        '2025-06-09': {
            hotel: 'London',
            activity: 'Explore',
            travel: 'Fly to London 22:50'
        }
    };

    // Function to format date as "Month Day"
    function formatDate(date) {
        return date.toLocaleString('default', { month: 'short', day: 'numeric' });
    }

    // Function to get day of week
    function getDayOfWeek(date) {
        return date.toLocaleString('default', { weekday: 'short' });
    }

    // Add weekday headers starting from Saturday
    const weekdays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'weekday-header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Function to get color class for a date
    function getColorClass(date) {
        const dateStr = date.toISOString().split('T')[0];
        const dateObj = new Date(dateStr);
        
        // May 24-25: Orange
        if (dateObj >= new Date('2025-05-24') && dateObj <= new Date('2025-05-25')) {
            return 'orange';
        }
        // May 26-28: Light green
        else if (dateObj >= new Date('2025-05-26') && dateObj <= new Date('2025-05-28')) {
            return 'light-green';
        }
        // May 29 - June 2: Light blue
        else if (dateObj >= new Date('2025-05-29') && dateObj <= new Date('2025-06-02')) {
            return 'light-blue';
        }
        // June 3-6: Light pink
        else if (dateObj >= new Date('2025-06-03') && dateObj <= new Date('2025-06-06')) {
            return 'light-pink';
        }
        return '';
    }

    // Function to create color dots
    function createColorDots(dayElement, date) {
        const colorDots = document.createElement('div');
        colorDots.className = 'color-dots';

        const colors = ['orange', 'light-green', 'light-blue', 'light-pink', 'grey'];
        colors.forEach(color => {
            const dot = document.createElement('div');
            dot.className = `color-dot ${color}`;
            dot.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                // Remove all color classes
                dayElement.classList.remove('orange', 'light-green', 'light-blue', 'light-pink', 'grey');
                // Add the selected color class
                dayElement.classList.add(color);
                // Save the color choice to localStorage
                const dateKey = date.toISOString().split('T')[0];
                localStorage.setItem(`color-${dateKey}`, color);
            });
            colorDots.appendChild(dot);
        });

        return colorDots;
    }

    // Function to create a day element
    function createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        // Add color class based on date
        const colorClass = getColorClass(date);
        if (colorClass) {
            dayElement.classList.add(colorClass);
        }

        // Add color dots
        const colorDots = createColorDots(dayElement, date);
        dayElement.appendChild(colorDots);

        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = formatDate(date);
        dayElement.appendChild(dayHeader);

        // Create sections for Hotel, Activity, and Travel
        const sections = ['Hotel', 'Activity', 'Travel'];
        const dateKey = date.toISOString().split('T')[0];
        const dayData = tripData[dateKey] || {};

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';

            const label = document.createElement('label');
            label.textContent = section;
            sectionDiv.appendChild(label);

            const textarea = document.createElement('textarea');
            textarea.placeholder = `Enter ${section.toLowerCase()} details...`;
            
            // Set initial value from trip data
            const sectionKey = section.toLowerCase();
            if (dayData[sectionKey]) {
                textarea.value = dayData[sectionKey];
            }

            textarea.addEventListener('input', function() {
                // Save the content to localStorage
                const key = `${dateKey}-${section}`;
                localStorage.setItem(key, textarea.value);
            });

            // Load saved content from localStorage
            const key = `${dateKey}-${section}`;
            const savedContent = localStorage.getItem(key);
            if (savedContent) {
                textarea.value = savedContent;
            }

            sectionDiv.appendChild(textarea);
            dayElement.appendChild(sectionDiv);
        });

        // Load saved color from localStorage
        const savedColor = localStorage.getItem(`color-${dateKey}`);
        if (savedColor) {
            dayElement.classList.remove('orange', 'light-green', 'light-blue', 'light-pink', 'grey');
            dayElement.classList.add(savedColor);
        }

        return dayElement;
    }

    // Generate calendar days
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        calendar.appendChild(createDayElement(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
    }
}); 