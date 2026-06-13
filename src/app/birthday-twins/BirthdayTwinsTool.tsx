"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";
import RelatedTools from "@/components/RelatedTools";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BDPerson { name: string; year: number; role: string }
type BirthdayDB = Record<string, BDPerson[]>;

// ── Hardcoded database — 365 days of famous birthdays ─────────────────────────
// Note: october-26 third entry typo fixed; september-22 fictional entry removed

const DB: BirthdayDB = {
  "january-1":[{name:"J.D. Salinger",year:1919,role:"Author of The Catcher in the Rye"},{name:"J. Edgar Hoover",year:1895,role:"First FBI Director"},{name:"Verne Troyer",year:1969,role:"Actor"},{name:"Frank Langella",year:1938,role:"Actor"}],
  "january-2":[{name:"Isaac Asimov",year:1920,role:"Science Fiction Author"},{name:"Cuba Gooding Jr.",year:1968,role:"Actor"},{name:"Taye Diggs",year:1971,role:"Actor"}],
  "january-3":[{name:"Mel Gibson",year:1956,role:"Actor and Director"},{name:"J.R.R. Tolkien",year:1892,role:"Author of Lord of the Rings"},{name:"Greta Thunberg",year:2003,role:"Climate Activist"}],
  "january-4":[{name:"Isaac Newton",year:1643,role:"Mathematician and Physicist"},{name:"Louis Braille",year:1809,role:"Inventor of Braille"},{name:"Julia Ormond",year:1965,role:"Actress"}],
  "january-5":[{name:"Diane Keaton",year:1946,role:"Actress"},{name:"Bradley Cooper",year:1975,role:"Actor"},{name:"Hayley Williams",year:1988,role:"Singer of Paramore"}],
  "january-6":[{name:"Joan of Arc",year:1412,role:"French Heroine and Saint"},{name:"Rowan Atkinson",year:1955,role:"Actor and Comedian"},{name:"Eddie Redmayne",year:1982,role:"Actor"}],
  "january-7":[{name:"Nicolas Cage",year:1964,role:"Actor"},{name:"Lewis Hamilton",year:1985,role:"Formula 1 Champion"},{name:"Jeremy Renner",year:1971,role:"Actor"}],
  "january-8":[{name:"David Bowie",year:1947,role:"Rock Legend"},{name:"Elvis Presley",year:1935,role:"King of Rock and Roll"},{name:"Stephen Hawking",year:1942,role:"Theoretical Physicist"}],
  "january-9":[{name:"Kate Middleton",year:1982,role:"Princess of Wales"},{name:"Richard Nixon",year:1913,role:"37th US President"},{name:"Jimmy Page",year:1944,role:"Led Zeppelin Guitarist"}],
  "january-10":[{name:"Rod Stewart",year:1945,role:"Rock Singer"},{name:"George Foreman",year:1949,role:"Boxing Champion"},{name:"Pat Benatar",year:1953,role:"Rock Singer"}],
  "january-11":[{name:"Mary J. Blige",year:1971,role:"Singer"},{name:"Alexander Hamilton",year:1755,role:"Founding Father"},{name:"Amanda Peet",year:1972,role:"Actress"}],
  "january-12":[{name:"Jeff Bezos",year:1964,role:"Amazon Founder"},{name:"Howard Stern",year:1954,role:"Radio Host"},{name:"Zayn Malik",year:1993,role:"Singer"}],
  "january-13":[{name:"Orlando Bloom",year:1977,role:"Actor"},{name:"Liam Hemsworth",year:1990,role:"Actor"},{name:"Julia Louis-Dreyfus",year:1961,role:"Actress"}],
  "january-14":[{name:"Dave Grohl",year:1969,role:"Foo Fighters Frontman"},{name:"LL Cool J",year:1968,role:"Rapper and Actor"},{name:"Jason Bateman",year:1969,role:"Actor"}],
  "january-15":[{name:"Martin Luther King Jr.",year:1929,role:"Civil Rights Leader"},{name:"Chad Lowe",year:1968,role:"Actor"},{name:"Pitbull",year:1981,role:"Rapper"}],
  "january-16":[{name:"Lin-Manuel Miranda",year:1980,role:"Hamilton Creator"},{name:"Kate Moss",year:1974,role:"Supermodel"},{name:"Aaliyah",year:1979,role:"Singer"}],
  "january-17":[{name:"Muhammad Ali",year:1942,role:"Boxing Legend"},{name:"Jim Carrey",year:1962,role:"Comedian and Actor"},{name:"Betty White",year:1922,role:"Actress and Comedian"}],
  "january-18":[{name:"Kevin Costner",year:1955,role:"Actor"},{name:"Cary Grant",year:1904,role:"Classic Hollywood Actor"},{name:"Dave Bautista",year:1969,role:"Actor and Wrestler"}],
  "january-19":[{name:"Dolly Parton",year:1946,role:"Country Music Legend"},{name:"Edgar Allan Poe",year:1809,role:"Author and Poet"},{name:"Janis Joplin",year:1943,role:"Rock Singer"}],
  "january-20":[{name:"Buzz Aldrin",year:1930,role:"Astronaut, Second Man on Moon"},{name:"Bill Maher",year:1956,role:"Comedian and TV Host"},{name:"Rainn Wilson",year:1966,role:"Actor"}],
  "january-21":[{name:"Geena Davis",year:1956,role:"Actress"},{name:"Jack Nicklaus",year:1940,role:"Golf Legend"},{name:"Emma Bunton",year:1976,role:"Spice Girl"}],
  "january-22":[{name:"Lord Byron",year:1788,role:"Romantic Poet"},{name:"Diane Lane",year:1965,role:"Actress"},{name:"Guy Fieri",year:1968,role:"TV Chef"}],
  "january-23":[{name:"Mariska Hargitay",year:1964,role:"Actress"},{name:"Tiffani Thiessen",year:1974,role:"Actress"},{name:"Ariel Winter",year:1998,role:"Actress"}],
  "january-24":[{name:"Neil Diamond",year:1941,role:"Singer and Songwriter"},{name:"John Belushi",year:1949,role:"Comedian and Actor"},{name:"Mischa Barton",year:1986,role:"Actress"}],
  "january-25":[{name:"Alicia Keys",year:1981,role:"Singer and Pianist"},{name:"Virginia Woolf",year:1882,role:"Author"},{name:"Robert Burns",year:1759,role:"Scottish Poet"}],
  "january-26":[{name:"Ellen DeGeneres",year:1958,role:"TV Host and Comedian"},{name:"Wayne Gretzky",year:1961,role:"Hockey Legend"},{name:"Paul Newman",year:1925,role:"Actor"}],
  "january-27":[{name:"Mozart",year:1756,role:"Classical Music Composer"},{name:"Lewis Carroll",year:1832,role:"Author of Alice in Wonderland"},{name:"Bridget Fonda",year:1964,role:"Actress"}],
  "january-28":[{name:"Elijah Wood",year:1981,role:"Actor"},{name:"Nicolas Sarkozy",year:1955,role:"Former French President"},{name:"Joey Fatone",year:1977,role:"NSYNC Member"}],
  "january-29":[{name:"Oprah Winfrey",year:1954,role:"Media Mogul and TV Host"},{name:"Tom Selleck",year:1945,role:"Actor"},{name:"Adam Lambert",year:1982,role:"Singer"}],
  "january-30":[{name:"Christian Bale",year:1974,role:"Actor"},{name:"Phil Collins",year:1951,role:"Musician"},{name:"Franklin D. Roosevelt",year:1882,role:"32nd US President"}],
  "january-31":[{name:"Justin Timberlake",year:1981,role:"Singer and Actor"},{name:"Minnie Driver",year:1970,role:"Actress"},{name:"Kerry Washington",year:1977,role:"Actress"}],
  "february-1":[{name:"Harry Styles",year:1994,role:"Singer and Actor"},{name:"Clark Gable",year:1901,role:"Classic Hollywood Actor"},{name:"Lisa Marie Presley",year:1968,role:"Singer"}],
  "february-2":[{name:"Shakira",year:1977,role:"Singer and Songwriter"},{name:"James Joyce",year:1882,role:"Author of Ulysses"},{name:"Christie Brinkley",year:1954,role:"Supermodel"}],
  "february-3":[{name:"Isla Fisher",year:1976,role:"Actress"},{name:"Amal Clooney",year:1978,role:"Human Rights Lawyer"},{name:"Warrick Thompson",year:1959,role:"Musician"}],
  "february-4":[{name:"Rosa Parks",year:1913,role:"Civil Rights Activist"},{name:"Alice Cooper",year:1948,role:"Rock Legend"},{name:"Natalie Imbruglia",year:1975,role:"Singer"}],
  "february-5":[{name:"Cristiano Ronaldo",year:1985,role:"Football Superstar"},{name:"Jennifer Jason Leigh",year:1962,role:"Actress"},{name:"Roberto Alomar",year:1968,role:"Baseball Hall of Famer"}],
  "february-6":[{name:"Bob Marley",year:1945,role:"Reggae Legend"},{name:"Ronald Reagan",year:1911,role:"40th US President"},{name:"Axl Rose",year:1962,role:"Guns N Roses Singer"}],
  "february-7":[{name:"Charles Dickens",year:1812,role:"Author of Great Expectations"},{name:"Ashton Kutcher",year:1978,role:"Actor"},{name:"Garth Brooks",year:1962,role:"Country Music Star"}],
  "february-8":[{name:"James Dean",year:1931,role:"Hollywood Icon"},{name:"Jules Verne",year:1828,role:"Science Fiction Author"},{name:"Seth Green",year:1974,role:"Actor and Comedian"}],
  "february-9":[{name:"Michael B. Jordan",year:1987,role:"Actor"},{name:"Tom Hiddleston",year:1981,role:"Actor"},{name:"Mia Farrow",year:1945,role:"Actress"}],
  "february-10":[{name:"Emma Roberts",year:1991,role:"Actress"},{name:"Elizabeth Banks",year:1974,role:"Actress"},{name:"Bertolt Brecht",year:1898,role:"Playwright"}],
  "february-11":[{name:"Jennifer Aniston",year:1969,role:"Actress"},{name:"Thomas Edison",year:1847,role:"Inventor"},{name:"Taylor Lautner",year:1992,role:"Actor"}],
  "february-12":[{name:"Abraham Lincoln",year:1809,role:"16th US President"},{name:"Charles Darwin",year:1809,role:"Naturalist and Scientist"},{name:"Josh Brolin",year:1968,role:"Actor"}],
  "february-13":[{name:"Robbie Williams",year:1974,role:"Singer"},{name:"Chuck Yeager",year:1923,role:"First Pilot to Break Sound Barrier"},{name:"Mena Suvari",year:1979,role:"Actress"}],
  "february-14":[{name:"Frederick Douglass",year:1818,role:"Abolitionist"},{name:"Michael Bloomberg",year:1942,role:"Businessman and Politician"},{name:"Drew Bledsoe",year:1972,role:"NFL Quarterback"}],
  "february-15":[{name:"Galileo Galilei",year:1564,role:"Astronomer and Physicist"},{name:"Matt Groening",year:1954,role:"Simpsons Creator"},{name:"Amber Valletta",year:1974,role:"Model and Actress"}],
  "february-16":[{name:"Ice-T",year:1958,role:"Rapper and Actor"},{name:"John McEnroe",year:1959,role:"Tennis Legend"},{name:"Kim Jong-il",year:1941,role:"North Korean Leader"}],
  "february-17":[{name:"Ed Sheeran",year:1991,role:"Singer and Songwriter"},{name:"Paris Hilton",year:1981,role:"Media Personality"},{name:"Michael Jordan",year:1963,role:"Basketball Legend"}],
  "february-18":[{name:"John Travolta",year:1954,role:"Actor"},{name:"Toni Morrison",year:1931,role:"Nobel Prize Winning Author"},{name:"Matt Dillon",year:1964,role:"Actor"}],
  "february-19":[{name:"Copernicus",year:1473,role:"Astronomer"},{name:"Seal",year:1963,role:"Singer"},{name:"Millie Bobby Brown",year:2004,role:"Actress"}],
  "february-20":[{name:"Rihanna",year:1988,role:"Singer and Entrepreneur"},{name:"Kurt Cobain",year:1967,role:"Nirvana Frontman"},{name:"Cindy Crawford",year:1966,role:"Supermodel"}],
  "february-21":[{name:"Ellen Page",year:1987,role:"Actor"},{name:"Nina Simone",year:1933,role:"Jazz Singer"},{name:"Kelsey Grammer",year:1955,role:"Actor"}],
  "february-22":[{name:"George Washington",year:1732,role:"First US President"},{name:"Steve Irwin",year:1962,role:"Crocodile Hunter"},{name:"Drew Barrymore",year:1975,role:"Actress"}],
  "february-23":[{name:"Dakota Fanning",year:1994,role:"Actress"},{name:"Emily Blunt",year:1983,role:"Actress"},{name:"Peter Fonda",year:1940,role:"Actor"}],
  "february-24":[{name:"Steve Jobs",year:1955,role:"Apple Co-Founder"},{name:"Floyd Mayweather",year:1977,role:"Boxing Champion"},{name:"Edward James Olmos",year:1947,role:"Actor"}],
  "february-25":[{name:"George Harrison",year:1943,role:"Beatle"},{name:"Rashida Jones",year:1976,role:"Actress"},{name:"Tea Leoni",year:1966,role:"Actress"}],
  "february-26":[{name:"Johnny Cash",year:1932,role:"Country Music Legend"},{name:"Victor Hugo",year:1802,role:"Author of Les Miserables"},{name:"Tony Randall",year:1920,role:"Actor"}],
  "february-27":[{name:"Elizabeth Taylor",year:1932,role:"Hollywood Actress"},{name:"Kate Mara",year:1983,role:"Actress"},{name:"Josh Groban",year:1981,role:"Singer"}],
  "february-28":[{name:"Frank Ocean",year:1987,role:"Singer and Songwriter"},{name:"Bernadette Peters",year:1948,role:"Actress"},{name:"Mario Andretti",year:1940,role:"Racing Driver"}],
  "february-29":[{name:"Ja Rule",year:1976,role:"Rapper"},{name:"Tony Robbins",year:1960,role:"Motivational Speaker"},{name:"Dinah Shore",year:1916,role:"Singer and TV Host"}],
  "march-1":[{name:"Justin Bieber",year:1994,role:"Singer"},{name:"Ron Howard",year:1954,role:"Director"},{name:"Javier Bardem",year:1969,role:"Actor"}],
  "march-2":[{name:"Jon Bon Jovi",year:1962,role:"Rock Singer"},{name:"Dr. Seuss",year:1904,role:"Children's Author"},{name:"Bryce Dallas Howard",year:1981,role:"Actress"}],
  "march-3":[{name:"Jessica Biel",year:1982,role:"Actress"},{name:"Alexander Graham Bell",year:1847,role:"Telephone Inventor"},{name:"Camila Cabello",year:1997,role:"Singer"}],
  "march-4":[{name:"Khaled",year:1975,role:"DJ and Producer"},{name:"Penn Jillette",year:1955,role:"Magician"},{name:"Emilio Estefan",year:1953,role:"Music Producer"}],
  "march-5":[{name:"Eva Mendes",year:1974,role:"Actress"},{name:"Andy Gibb",year:1958,role:"Singer"},{name:"Penn Jillette",year:1955,role:"Magician"}],
  "march-6":[{name:"Shaquille O'Neal",year:1972,role:"Basketball Legend"},{name:"Michelangelo",year:1475,role:"Renaissance Artist"},{name:"Rob Reiner",year:1947,role:"Director"}],
  "march-7":[{name:"Rachel Weisz",year:1970,role:"Actress"},{name:"Bryan Cranston",year:1956,role:"Actor"},{name:"Jenna Fischer",year:1974,role:"Actress"}],
  "march-8":[{name:"James Van Der Beek",year:1977,role:"Actor"},{name:"Freddie Prinze Jr.",year:1976,role:"Actor"},{name:"Aidan Quinn",year:1959,role:"Actor"}],
  "march-9":[{name:"Juliette Binoche",year:1964,role:"Actress"},{name:"Bobby Fischer",year:1943,role:"Chess Champion"},{name:"Lil Bow Wow",year:1987,role:"Rapper"}],
  "march-10":[{name:"Chuck Norris",year:1940,role:"Actor and Martial Artist"},{name:"Sharon Stone",year:1958,role:"Actress"},{name:"Olivia Wilde",year:1984,role:"Actress and Director"}],
  "march-11":[{name:"Thora Birch",year:1982,role:"Actress"},{name:"Johnny Knoxville",year:1971,role:"Actor"},{name:"Lawrence Welk",year:1903,role:"Musician"}],
  "march-12":[{name:"Liza Minnelli",year:1946,role:"Actress and Singer"},{name:"James Taylor",year:1948,role:"Singer and Songwriter"},{name:"Stromae",year:1985,role:"Belgian Singer"}],
  "march-13":[{name:"William H. Macy",year:1950,role:"Actor"},{name:"Dana Carvey",year:1955,role:"Comedian"},{name:"Common",year:1972,role:"Rapper and Actor"}],
  "march-14":[{name:"Albert Einstein",year:1879,role:"Theoretical Physicist"},{name:"Stephen Curry",year:1988,role:"NBA Basketball Player"},{name:"Billy Crystal",year:1948,role:"Comedian and Actor"}],
  "march-15":[{name:"Eva Longoria",year:1975,role:"Actress"},{name:"will.i.am",year:1975,role:"Black Eyed Peas Member"},{name:"Fabio",year:1959,role:"Model"}],
  "march-16":[{name:"Lauren Graham",year:1967,role:"Actress"},{name:"Jerry Lewis",year:1926,role:"Comedian"},{name:"Flavor Flav",year:1959,role:"Rapper"}],
  "march-17":[{name:"Nat King Cole",year:1919,role:"Jazz Musician"},{name:"Rob Lowe",year:1964,role:"Actor"},{name:"Kurt Russell",year:1951,role:"Actor"}],
  "march-18":[{name:"Queen Latifah",year:1970,role:"Rapper and Actress"},{name:"Adam Levine",year:1979,role:"Maroon 5 Singer"},{name:"Grover Cleveland",year:1837,role:"22nd and 24th US President"}],
  "march-19":[{name:"Bruce Willis",year:1955,role:"Actor"},{name:"Glenn Close",year:1947,role:"Actress"},{name:"Garrett Hedlund",year:1984,role:"Actor"}],
  "march-20":[{name:"Spike Lee",year:1957,role:"Film Director"},{name:"Chester Bennington",year:1976,role:"Linkin Park Singer"},{name:"Hal Ashby",year:1929,role:"Director"}],
  "march-21":[{name:"Matthew Broderick",year:1962,role:"Actor"},{name:"Rosie O'Donnell",year:1962,role:"Comedian and TV Host"},{name:"Johann Sebastian Bach",year:1685,role:"Classical Composer"}],
  "march-22":[{name:"Reese Witherspoon",year:1976,role:"Actress"},{name:"William Shatner",year:1931,role:"Actor"},{name:"James Patterson",year:1947,role:"Author"}],
  "march-23":[{name:"Chaka Khan",year:1953,role:"Singer"},{name:"Princess Eugenie",year:1990,role:"British Royal"},{name:"Damon Albarn",year:1968,role:"Blur Singer"}],
  "march-24":[{name:"Jim Parsons",year:1973,role:"Actor"},{name:"Peyton Manning",year:1976,role:"NFL Quarterback"},{name:"Steve McQueen",year:1930,role:"Hollywood Actor"}],
  "march-25":[{name:"Elton John",year:1947,role:"Music Legend"},{name:"Sarah Jessica Parker",year:1965,role:"Actress"},{name:"Aretha Franklin",year:1942,role:"Queen of Soul"}],
  "march-26":[{name:"Diana Ross",year:1944,role:"Singer and Actress"},{name:"Steven Tyler",year:1948,role:"Aerosmith Singer"},{name:"Keira Knightley",year:1985,role:"Actress"}],
  "march-27":[{name:"Mariah Carey",year:1969,role:"Singer"},{name:"Quentin Tarantino",year:1963,role:"Film Director"},{name:"Nathan Fillion",year:1971,role:"Actor"}],
  "march-28":[{name:"Lady Gaga",year:1986,role:"Singer and Actress"},{name:"Reba McEntire",year:1955,role:"Country Singer"},{name:"Vince Vaughn",year:1970,role:"Actor"}],
  "march-29":[{name:"John Tyler",year:1790,role:"10th US President"},{name:"Eric Idle",year:1943,role:"Monty Python Member"},{name:"Elle Macpherson",year:1963,role:"Supermodel"}],
  "march-30":[{name:"Eric Clapton",year:1945,role:"Guitar Legend"},{name:"Vincent van Gogh",year:1853,role:"Post-Impressionist Painter"},{name:"Celine Dion",year:1968,role:"Singer"}],
  "march-31":[{name:"Ewan McGregor",year:1971,role:"Actor"},{name:"Al Gore",year:1948,role:"Former US Vice President"},{name:"Christopher Walken",year:1943,role:"Actor"}],
  "april-1":[{name:"Susan Boyle",year:1961,role:"Singer"},{name:"Debbie Reynolds",year:1932,role:"Actress"},{name:"Randy Orton",year:1980,role:"WWE Champion"}],
  "april-2":[{name:"Michael Fassbender",year:1977,role:"Actor"},{name:"Marvin Gaye",year:1939,role:"Soul Music Legend"},{name:"Hans Christian Andersen",year:1805,role:"Fairy Tale Author"}],
  "april-3":[{name:"Eddie Murphy",year:1961,role:"Comedian and Actor"},{name:"Alec Baldwin",year:1958,role:"Actor"},{name:"Jane Goodall",year:1934,role:"Primatologist"}],
  "april-4":[{name:"Robert Downey Jr.",year:1965,role:"Actor"},{name:"Maya Angelou",year:1928,role:"Poet and Author"},{name:"Heath Ledger",year:1979,role:"Actor"}],
  "april-5":[{name:"Pharrell Williams",year:1973,role:"Singer and Producer"},{name:"Colin Powell",year:1937,role:"US Secretary of State"},{name:"Spencer Tracy",year:1900,role:"Classic Actor"}],
  "april-6":[{name:"Paul Rudd",year:1969,role:"Actor"},{name:"Zach Braff",year:1975,role:"Actor and Director"},{name:"Candace Cameron",year:1976,role:"Actress"}],
  "april-7":[{name:"Russell Crowe",year:1964,role:"Actor"},{name:"Jackie Chan",year:1954,role:"Actor and Martial Artist"},{name:"James Garner",year:1928,role:"Actor"}],
  "april-8":[{name:"Robin Wright",year:1966,role:"Actress"},{name:"Patricia Arquette",year:1968,role:"Actress"},{name:"Kofi Annan",year:1938,role:"UN Secretary General"}],
  "april-9":[{name:"Kristen Stewart",year:1990,role:"Actress"},{name:"Dennis Quaid",year:1954,role:"Actor"},{name:"Cynthia Nixon",year:1966,role:"Actress"}],
  "april-10":[{name:"Mandy Moore",year:1984,role:"Singer and Actress"},{name:"Steven Seagal",year:1952,role:"Actor"},{name:"Chuck Connors",year:1921,role:"Actor"}],
  "april-11":[{name:"Jeremy Clarkson",year:1960,role:"TV Presenter"},{name:"Joel Grey",year:1932,role:"Actor"},{name:"Alessandra Ambrosio",year:1981,role:"Supermodel"}],
  "april-12":[{name:"David Letterman",year:1947,role:"TV Host"},{name:"Claire Danes",year:1979,role:"Actress"},{name:"Andy Garcia",year:1956,role:"Actor"}],
  "april-13":[{name:"Thomas Jefferson",year:1743,role:"3rd US President"},{name:"Al Green",year:1946,role:"Soul Singer"},{name:"Ricky Schroder",year:1970,role:"Actor"}],
  "april-14":[{name:"Adrien Brody",year:1973,role:"Actor"},{name:"Sarah Michelle Gellar",year:1977,role:"Actress"},{name:"Pete Rose",year:1941,role:"Baseball Legend"}],
  "april-15":[{name:"Leonardo da Vinci",year:1452,role:"Renaissance Genius"},{name:"Emma Watson",year:1990,role:"Actress and Activist"},{name:"Seth Rogen",year:1982,role:"Actor and Comedian"}],
  "april-16":[{name:"Charlie Chaplin",year:1889,role:"Silent Film Legend"},{name:"Selena",year:1971,role:"Queen of Tejano Music"},{name:"Martin Lawrence",year:1965,role:"Comedian and Actor"}],
  "april-17":[{name:"Victoria Beckham",year:1974,role:"Spice Girl and Designer"},{name:"Jennifer Garner",year:1972,role:"Actress"},{name:"Nick Nolte",year:1941,role:"Actor"}],
  "april-18":[{name:"Conan O'Brien",year:1963,role:"TV Host and Comedian"},{name:"James Woods",year:1947,role:"Actor"},{name:"Melissa Joan Hart",year:1976,role:"Actress"}],
  "april-19":[{name:"Kate Hudson",year:1979,role:"Actress"},{name:"Tim Curry",year:1946,role:"Actor"},{name:"Ashley Judd",year:1968,role:"Actress"}],
  "april-20":[{name:"Jessica Lange",year:1949,role:"Actress"},{name:"Miranda Kerr",year:1983,role:"Supermodel"},{name:"Carmen Electra",year:1972,role:"Model and Actress"}],
  "april-21":[{name:"Queen Elizabeth II",year:1926,role:"Queen of England"},{name:"Tony Danza",year:1951,role:"Actor"},{name:"Andie MacDowell",year:1958,role:"Actress"}],
  "april-22":[{name:"Jack Nicholson",year:1937,role:"Actor"},{name:"Peter Frampton",year:1950,role:"Rock Musician"},{name:"Amber Heard",year:1986,role:"Actress"}],
  "april-23":[{name:"William Shakespeare",year:1564,role:"Playwright and Poet"},{name:"John Cena",year:1977,role:"Wrestler and Actor"},{name:"Dev Patel",year:1990,role:"Actor"}],
  "april-24":[{name:"Barbra Streisand",year:1942,role:"Singer and Actress"},{name:"Kelly Clarkson",year:1982,role:"Singer"},{name:"Djimon Hounsou",year:1964,role:"Actor"}],
  "april-25":[{name:"Renee Zellweger",year:1969,role:"Actress"},{name:"Al Pacino",year:1940,role:"Actor"},{name:"Ella Fitzgerald",year:1917,role:"Jazz Legend"}],
  "april-26":[{name:"Channing Tatum",year:1980,role:"Actor"},{name:"Carol Burnett",year:1933,role:"Comedian and Actress"},{name:"Jordana Brewster",year:1980,role:"Actress"}],
  "april-27":[{name:"Ulysses S. Grant",year:1822,role:"18th US President"},{name:"Sheena Easton",year:1959,role:"Singer"},{name:"Josh Groban",year:1981,role:"Singer"}],
  "april-28":[{name:"Jay Leno",year:1950,role:"TV Host and Comedian"},{name:"Penelope Cruz",year:1974,role:"Actress"},{name:"Jessica Alba",year:1981,role:"Actress"}],
  "april-29":[{name:"Uma Thurman",year:1970,role:"Actress"},{name:"Jerry Seinfeld",year:1954,role:"Comedian"},{name:"Daniel Day-Lewis",year:1957,role:"Actor"}],
  "april-30":[{name:"Kirsten Dunst",year:1982,role:"Actress"},{name:"Travis Scott",year:1991,role:"Rapper"},{name:"Willie Nelson",year:1933,role:"Country Music Legend"}],
  "may-1":[{name:"Tim McGraw",year:1967,role:"Country Singer"},{name:"Wes Anderson",year:1969,role:"Film Director"},{name:"Jamie Dornan",year:1982,role:"Actor"}],
  "may-2":[{name:"Dwayne Johnson",year:1972,role:"Actor and Former Wrestler"},{name:"David Beckham",year:1975,role:"Football Legend"},{name:"Donatella Versace",year:1955,role:"Fashion Designer"}],
  "may-3":[{name:"James Brown",year:1933,role:"Godfather of Soul"},{name:"Bing Crosby",year:1903,role:"Singer and Actor"},{name:"Christina Hendricks",year:1975,role:"Actress"}],
  "may-4":[{name:"Audrey Hepburn",year:1929,role:"Actress and Humanitarian"},{name:"Will Arnett",year:1970,role:"Actor and Comedian"},{name:"Randy Travis",year:1959,role:"Country Singer"}],
  "may-5":[{name:"Adele",year:1988,role:"Singer and Songwriter"},{name:"Karl Marx",year:1818,role:"Philosopher and Economist"},{name:"Henry Cavill",year:1983,role:"Actor"}],
  "may-6":[{name:"George Clooney",year:1961,role:"Actor and Director"},{name:"Sigmund Freud",year:1856,role:"Father of Psychoanalysis"},{name:"Chris Paul",year:1985,role:"NBA Player"}],
  "may-7":[{name:"Johannes Brahms",year:1833,role:"Classical Composer"},{name:"Gary Cooper",year:1901,role:"Hollywood Actor"},{name:"Eva Peron",year:1919,role:"Former First Lady of Argentina"}],
  "may-8":[{name:"David Attenborough",year:1926,role:"Naturalist and Broadcaster"},{name:"Enrique Iglesias",year:1975,role:"Singer"},{name:"Melissa Gilbert",year:1964,role:"Actress"}],
  "may-9":[{name:"Candice Swanepoel",year:1988,role:"Supermodel"},{name:"Billy Joel",year:1949,role:"Piano Man"},{name:"Glenda Jackson",year:1936,role:"Actress and Politician"}],
  "may-10":[{name:"Bono",year:1960,role:"U2 Lead Singer"},{name:"Fred Astaire",year:1899,role:"Dancer and Actor"},{name:"Kenan Thompson",year:1978,role:"Comedian and Actor"}],
  "may-11":[{name:"Salvador Dali",year:1904,role:"Surrealist Artist"},{name:"Natasha Richardson",year:1963,role:"Actress"},{name:"Cam Newton",year:1989,role:"NFL Quarterback"}],
  "may-12":[{name:"Florence Nightingale",year:1820,role:"Founder of Modern Nursing"},{name:"Emilio Estevez",year:1962,role:"Actor and Director"},{name:"Kim Fields",year:1969,role:"Actress"}],
  "may-13":[{name:"Stevie Wonder",year:1950,role:"Music Legend"},{name:"Harvey Keitel",year:1939,role:"Actor"},{name:"Robert Pattinson",year:1986,role:"Actor"}],
  "may-14":[{name:"Mark Zuckerberg",year:1984,role:"Facebook Founder"},{name:"Cate Blanchett",year:1969,role:"Actress"},{name:"George Lucas",year:1944,role:"Star Wars Creator"}],
  "may-15":[{name:"Madeleine Albright",year:1937,role:"First Female US Secretary of State"},{name:"Andy Murray",year:1987,role:"Tennis Champion"},{name:"Zara Phillips",year:1981,role:"British Royal"}],
  "may-16":[{name:"Megan Fox",year:1986,role:"Actress"},{name:"Pierce Brosnan",year:1953,role:"Actor and James Bond"},{name:"Janet Jackson",year:1966,role:"Singer"}],
  "may-17":[{name:"Enya",year:1961,role:"Singer and Musician"},{name:"Sugar Ray Leonard",year:1956,role:"Boxing Champion"},{name:"Dennis Hopper",year:1936,role:"Actor and Director"}],
  "may-18":[{name:"Pope John Paul II",year:1920,role:"Catholic Pope"},{name:"Tina Fey",year:1970,role:"Comedian and Writer"},{name:"Jack Johnson",year:1975,role:"Singer and Songwriter"}],
  "may-19":[{name:"Malcolm X",year:1925,role:"Civil Rights Leader"},{name:"Pete Townshend",year:1945,role:"The Who Guitarist"},{name:"Kevin Garnett",year:1976,role:"NBA Champion"}],
  "may-20":[{name:"Cher",year:1946,role:"Singer and Actress"},{name:"Jimmy Stewart",year:1908,role:"Hollywood Actor"},{name:"Tony Goldwyn",year:1960,role:"Actor"}],
  "may-21":[{name:"Al Franken",year:1951,role:"Comedian and Politician"},{name:"Mr. T",year:1952,role:"Actor"},{name:"Gotye",year:1980,role:"Singer"}],
  "may-22":[{name:"Naomi Campbell",year:1970,role:"Supermodel"},{name:"Arthur Conan Doyle",year:1859,role:"Sherlock Holmes Author"},{name:"Ginnifer Goodwin",year:1978,role:"Actress"}],
  "may-23":[{name:"Drew Carey",year:1958,role:"Comedian and TV Host"},{name:"Joan Collins",year:1933,role:"Actress"},{name:"Jewel",year:1974,role:"Singer and Songwriter"}],
  "may-24":[{name:"Bob Dylan",year:1941,role:"Music Legend and Nobel Laureate"},{name:"Priscilla Presley",year:1945,role:"Actress"},{name:"Queen Victoria",year:1819,role:"Queen of England"}],
  "may-25":[{name:"Mike Myers",year:1963,role:"Comedian and Actor"},{name:"Octavia Spencer",year:1970,role:"Actress"},{name:"Ian McKellen",year:1939,role:"Actor"}],
  "may-26":[{name:"Lenny Kravitz",year:1964,role:"Rock Singer"},{name:"Helena Bonham Carter",year:1966,role:"Actress"},{name:"John Wayne",year:1907,role:"Hollywood Actor"}],
  "may-27":[{name:"Henry Kissinger",year:1923,role:"US Secretary of State"},{name:"Todd Bridges",year:1965,role:"Actor"},{name:"Jamie Oliver",year:1975,role:"Celebrity Chef"}],
  "may-28":[{name:"Kylie Minogue",year:1968,role:"Pop Singer"},{name:"Gladys Knight",year:1944,role:"Soul Singer"},{name:"Ian Fleming",year:1908,role:"James Bond Author"}],
  "may-29":[{name:"John F. Kennedy",year:1917,role:"35th US President"},{name:"Bob Hope",year:1903,role:"Comedian and Actor"},{name:"LaToya Jackson",year:1956,role:"Singer"}],
  "may-30":[{name:"Idina Menzel",year:1971,role:"Actress and Singer"},{name:"Cee Lo Green",year:1974,role:"Singer"},{name:"Mel Blanc",year:1908,role:"Voice of Bugs Bunny"}],
  "may-31":[{name:"Clint Eastwood",year:1930,role:"Actor and Director"},{name:"Brooke Shields",year:1965,role:"Actress and Model"},{name:"Colin Farrell",year:1976,role:"Actor"}],
  "june-1":[{name:"Marilyn Monroe",year:1926,role:"Hollywood Icon"},{name:"Morgan Freeman",year:1937,role:"Actor"},{name:"Alanis Morissette",year:1974,role:"Singer"}],
  "june-2":[{name:"Wentworth Miller",year:1972,role:"Actor"},{name:"Zachary Quinto",year:1977,role:"Actor"},{name:"Marquis de Sade",year:1740,role:"French Author"}],
  "june-3":[{name:"Rafael Nadal",year:1986,role:"Tennis Champion"},{name:"Anderson Cooper",year:1967,role:"CNN Anchor"},{name:"Tony Curtis",year:1925,role:"Actor"}],
  "june-4":[{name:"Angelina Jolie",year:1975,role:"Actress and Humanitarian"},{name:"Russell Brand",year:1975,role:"Comedian and Actor"},{name:"Bar Refaeli",year:1985,role:"Supermodel"}],
  "june-5":[{name:"Mark Wahlberg",year:1971,role:"Actor and Producer"},{name:"Kenny G",year:1956,role:"Saxophonist"},{name:"Rick Riordan",year:1964,role:"Percy Jackson Author"}],
  "june-6":[{name:"Paul Giamatti",year:1967,role:"Actor"},{name:"Gary Oldman",year:1958,role:"Actor"},{name:"Sandra Bernhard",year:1955,role:"Comedian and Actress"}],
  "june-7":[{name:"Prince",year:1958,role:"Music Legend"},{name:"Liam Neeson",year:1952,role:"Actor"},{name:"Bear Grylls",year:1974,role:"Adventurer and TV Host"}],
  "june-8":[{name:"Kanye West",year:1977,role:"Rapper and Producer"},{name:"Frank Lloyd Wright",year:1867,role:"Architect"},{name:"Tim Berners-Lee",year:1955,role:"World Wide Web Inventor"}],
  "june-9":[{name:"Johnny Depp",year:1963,role:"Actor"},{name:"Michael J. Fox",year:1961,role:"Actor"},{name:"Natalie Portman",year:1981,role:"Actress"}],
  "june-10":[{name:"Judy Garland",year:1922,role:"Actress and Singer"},{name:"Elizabeth Hurley",year:1965,role:"Actress and Model"},{name:"Kate Upton",year:1992,role:"Model"}],
  "june-11":[{name:"Shia LaBeouf",year:1986,role:"Actor"},{name:"Gene Wilder",year:1933,role:"Actor and Comedian"},{name:"Adriana Lima",year:1981,role:"Supermodel"}],
  "june-12":[{name:"Anne Frank",year:1929,role:"Diarist and Holocaust Victim"},{name:"George H.W. Bush",year:1924,role:"41st US President"},{name:"Dave Franco",year:1985,role:"Actor"}],
  "june-13":[{name:"Chris Evans",year:1981,role:"Actor"},{name:"Mary-Kate and Ashley Olsen",year:1986,role:"Actresses and Designers"},{name:"Tim Allen",year:1953,role:"Actor and Comedian"}],
  "june-14":[{name:"Donald Trump",year:1946,role:"45th and 47th US President"},{name:"Steffi Graf",year:1969,role:"Tennis Legend"},{name:"Boy George",year:1961,role:"Singer"}],
  "june-15":[{name:"Neil Patrick Harris",year:1973,role:"Actor"},{name:"Ice Cube",year:1969,role:"Rapper and Actor"},{name:"Helen Hunt",year:1963,role:"Actress"}],
  "june-16":[{name:"Tupac Shakur",year:1971,role:"Rap Legend"},{name:"Joyce Carol Oates",year:1938,role:"Author"},{name:"John Cho",year:1972,role:"Actor"}],
  "june-17":[{name:"Barry Manilow",year:1943,role:"Singer"},{name:"Venus Williams",year:1980,role:"Tennis Champion"},{name:"Greg Kinnear",year:1963,role:"Actor"}],
  "june-18":[{name:"Paul McCartney",year:1942,role:"Beatle"},{name:"Carol Kane",year:1952,role:"Actress"},{name:"Isabella Rossellini",year:1952,role:"Actress and Model"}],
  "june-19":[{name:"Paula Abdul",year:1962,role:"Singer and TV Judge"},{name:"Zoe Saldana",year:1978,role:"Actress"},{name:"Kathleen Turner",year:1954,role:"Actress"}],
  "june-20":[{name:"John Goodman",year:1952,role:"Actor"},{name:"Nicole Kidman",year:1967,role:"Actress"},{name:"Lionel Richie",year:1949,role:"Singer"}],
  "june-21":[{name:"Prince William",year:1982,role:"Prince of Wales"},{name:"Chris Pratt",year:1979,role:"Actor"},{name:"Juliette Lewis",year:1973,role:"Actress"}],
  "june-22":[{name:"Meryl Streep",year:1949,role:"Actress"},{name:"Cyndi Lauper",year:1953,role:"Singer"},{name:"Carson Daly",year:1973,role:"TV Host"}],
  "june-23":[{name:"Selma Blair",year:1972,role:"Actress"},{name:"Randy Jackson",year:1956,role:"American Idol Judge"},{name:"Alan Turing",year:1912,role:"Computer Science Pioneer"}],
  "june-24":[{name:"Mindy Kaling",year:1979,role:"Actress and Writer"},{name:"Lionel Messi",year:1987,role:"Football Legend"},{name:"Jack Dempsey",year:1895,role:"Boxing Champion"}],
  "june-25":[{name:"George Orwell",year:1903,role:"Author of 1984"},{name:"Ricky Gervais",year:1961,role:"Comedian and Actor"},{name:"Carly Simon",year:1945,role:"Singer"}],
  "june-26":[{name:"Derek Jeter",year:1974,role:"Baseball Legend"},{name:"Ariana Grande",year:1993,role:"Singer"},{name:"Chris O'Donnell",year:1970,role:"Actor"}],
  "june-27":[{name:"Helen Keller",year:1880,role:"Author and Activist"},{name:"Tobey Maguire",year:1975,role:"Actor"},{name:"Khloe Kardashian",year:1984,role:"TV Personality"}],
  "june-28":[{name:"Elon Musk",year:1971,role:"Entrepreneur and Billionaire"},{name:"John Cusack",year:1966,role:"Actor"},{name:"Mel Brooks",year:1926,role:"Comedian and Director"}],
  "june-29":[{name:"Gary Busey",year:1944,role:"Actor"},{name:"Nicole Scherzinger",year:1978,role:"Singer"},{name:"Antoine de Saint-Exupery",year:1900,role:"Little Prince Author"}],
  "june-30":[{name:"Mike Tyson",year:1966,role:"Boxing Champion"},{name:"Lena Horne",year:1917,role:"Singer and Actress"},{name:"Michael Phelps",year:1985,role:"Olympic Swimming Champion"}],
  "july-1":[{name:"Princess Diana",year:1961,role:"Princess of Wales"},{name:"Pamela Anderson",year:1967,role:"Actress and Model"},{name:"Liv Tyler",year:1977,role:"Actress"}],
  "july-2":[{name:"Lindsay Lohan",year:1986,role:"Actress"},{name:"Thurgood Marshall",year:1908,role:"First Black Supreme Court Justice"},{name:"Herman Hesse",year:1877,role:"Author"}],
  "july-3":[{name:"Tom Cruise",year:1962,role:"Actor"},{name:"Franz Kafka",year:1883,role:"Author"},{name:"Montel Williams",year:1956,role:"TV Host"}],
  "july-4":[{name:"Post Malone",year:1995,role:"Rapper and Singer"},{name:"Calvin Coolidge",year:1872,role:"30th US President"},{name:"Neil Simon",year:1927,role:"Playwright"}],
  "july-5":[{name:"Robbie Robertson",year:1943,role:"The Band Guitarist"},{name:"Eva Green",year:1980,role:"Actress"},{name:"Megan Rapinoe",year:1985,role:"Soccer Champion"}],
  "july-6":[{name:"Frida Kahlo",year:1907,role:"Mexican Painter"},{name:"George W. Bush",year:1946,role:"43rd US President"},{name:"Sylvester Stallone",year:1946,role:"Actor"}],
  "july-7":[{name:"Ringo Starr",year:1940,role:"Beatle"},{name:"Jim Gaffigan",year:1966,role:"Comedian"},{name:"Michelle Kwan",year:1980,role:"Olympic Figure Skater"}],
  "july-8":[{name:"Kevin Bacon",year:1958,role:"Actor"},{name:"Anjelica Huston",year:1951,role:"Actress"},{name:"Jaden Smith",year:1998,role:"Actor and Rapper"}],
  "july-9":[{name:"Tom Hanks",year:1956,role:"Actor"},{name:"Courtney Love",year:1964,role:"Singer and Actress"},{name:"Fred Savage",year:1976,role:"Actor and Director"}],
  "july-10":[{name:"Jessica Simpson",year:1980,role:"Singer and Businesswoman"},{name:"Nikola Tesla",year:1856,role:"Inventor"},{name:"Sofia Vergara",year:1972,role:"Actress"}],
  "july-11":[{name:"Yul Brynner",year:1920,role:"Actor"},{name:"Tab Hunter",year:1931,role:"Actor"},{name:"Caroline Wozniacki",year:1990,role:"Tennis Champion"}],
  "july-12":[{name:"Malala Yousafzai",year:1997,role:"Nobel Peace Prize Winner"},{name:"Bill Cosby",year:1937,role:"Comedian and Actor"},{name:"Henry David Thoreau",year:1817,role:"Author and Philosopher"}],
  "july-13":[{name:"Harrison Ford",year:1942,role:"Actor"},{name:"Patrick Stewart",year:1940,role:"Actor"},{name:"Cameron Crowe",year:1957,role:"Director"}],
  "july-14":[{name:"Gerald Ford",year:1913,role:"38th US President"},{name:"Ingmar Bergman",year:1918,role:"Film Director"},{name:"Matthew Fox",year:1966,role:"Actor"}],
  "july-15":[{name:"Diane Kruger",year:1976,role:"Actress"},{name:"Rembrandt",year:1606,role:"Dutch Master Painter"},{name:"Forest Whitaker",year:1961,role:"Actor"}],
  "july-16":[{name:"Will Ferrell",year:1967,role:"Comedian and Actor"},{name:"Corey Feldman",year:1971,role:"Actor"},{name:"Phoebe Cates",year:1963,role:"Actress"}],
  "july-17":[{name:"David Hasselhoff",year:1952,role:"Actor"},{name:"Angela Merkel",year:1954,role:"Former German Chancellor"},{name:"Camilla Parker Bowles",year:1947,role:"Queen Consort of England"}],
  "july-18":[{name:"Nelson Mandela",year:1918,role:"South African President"},{name:"Vin Diesel",year:1967,role:"Actor"},{name:"Dicky Betts",year:1943,role:"Allman Brothers Guitarist"}],
  "july-19":[{name:"Benedict Cumberbatch",year:1976,role:"Actor"},{name:"Brian May",year:1947,role:"Queen Guitarist"},{name:"Campbell Scott",year:1961,role:"Actor"}],
  "july-20":[{name:"Gisele Bundchen",year:1980,role:"Supermodel"},{name:"Carlos Santana",year:1947,role:"Rock Guitarist"},{name:"Diana Rigg",year:1938,role:"Actress"}],
  "july-21":[{name:"Robin Williams",year:1951,role:"Comedian and Actor"},{name:"Ernest Hemingway",year:1899,role:"Nobel Prize Winning Author"},{name:"Josh Hartnett",year:1978,role:"Actor"}],
  "july-22":[{name:"Prince George",year:2013,role:"British Royal"},{name:"Selena Gomez",year:1992,role:"Singer and Actress"},{name:"Danny Glover",year:1946,role:"Actor"}],
  "july-23":[{name:"Daniel Radcliffe",year:1989,role:"Actor"},{name:"Monica Lewinsky",year:1973,role:"Activist"},{name:"Woody Harrelson",year:1961,role:"Actor"}],
  "july-24":[{name:"Jennifer Lopez",year:1969,role:"Singer and Actress"},{name:"Amelia Earhart",year:1897,role:"Aviation Pioneer"},{name:"Barry Bonds",year:1964,role:"Baseball Home Run Record Holder"}],
  "july-25":[{name:"Matt LeBlanc",year:1967,role:"Actor"},{name:"Iman",year:1955,role:"Supermodel"},{name:"Estelle Getty",year:1923,role:"Actress"}],
  "july-26":[{name:"Mick Jagger",year:1943,role:"Rolling Stones Singer"},{name:"Kate Beckinsale",year:1973,role:"Actress"},{name:"Sandra Bullock",year:1964,role:"Actress"}],
  "july-27":[{name:"Alex Rodriguez",year:1975,role:"Baseball Star"},{name:"Nikolaj Coster-Waldau",year:1970,role:"Actor"},{name:"Maya Rudolph",year:1972,role:"Comedian and Actress"}],
  "july-28":[{name:"Jacqueline Kennedy Onassis",year:1929,role:"First Lady"},{name:"Lori Loughlin",year:1964,role:"Actress"},{name:"Hugo Chavez",year:1954,role:"Venezuelan President"}],
  "july-29":[{name:"Wil Wheaton",year:1972,role:"Actor"},{name:"Dan Quayle",year:1947,role:"Former US Vice President"},{name:"Josh Radnor",year:1974,role:"Actor"}],
  "july-30":[{name:"Arnold Schwarzenegger",year:1947,role:"Actor and Governor"},{name:"Henry Ford",year:1863,role:"Ford Motor Company Founder"},{name:"Simon Baker",year:1969,role:"Actor"}],
  "july-31":[{name:"J.K. Rowling",year:1965,role:"Harry Potter Author"},{name:"Wesley Snipes",year:1962,role:"Actor"},{name:"Dean Cain",year:1966,role:"Actor"}],
  "august-1":[{name:"Jerry Garcia",year:1942,role:"Grateful Dead Guitarist"},{name:"Sam Mendes",year:1965,role:"Director"},{name:"Coolio",year:1963,role:"Rapper"}],
  "august-2":[{name:"Mary-Louise Parker",year:1964,role:"Actress"},{name:"James Baldwin",year:1924,role:"Author and Activist"},{name:"Kevin Smith",year:1970,role:"Director"}],
  "august-3":[{name:"Tom Brady",year:1977,role:"NFL Champion"},{name:"Martin Sheen",year:1940,role:"Actor"},{name:"Martha Stewart",year:1941,role:"Lifestyle Guru"}],
  "august-4":[{name:"Barack Obama",year:1961,role:"44th US President"},{name:"Billy Bob Thornton",year:1955,role:"Actor and Director"},{name:"Meghan Markle",year:1981,role:"Duchess of Sussex"}],
  "august-5":[{name:"Neil Armstrong",year:1930,role:"First Man on the Moon"},{name:"Loni Anderson",year:1945,role:"Actress"},{name:"Patrick Ewing",year:1962,role:"NBA Champion"}],
  "august-6":[{name:"Andy Warhol",year:1928,role:"Pop Art Pioneer"},{name:"Vera Farmiga",year:1973,role:"Actress"},{name:"M. Night Shyamalan",year:1970,role:"Director"}],
  "august-7":[{name:"Charlize Theron",year:1975,role:"Actress"},{name:"David Duchovny",year:1960,role:"Actor"},{name:"Greg Louganis",year:1960,role:"Olympic Diving Champion"}],
  "august-8":[{name:"Roger Federer",year:1981,role:"Tennis Legend"},{name:"Dustin Hoffman",year:1937,role:"Actor"},{name:"The Edge",year:1961,role:"U2 Guitarist"}],
  "august-9":[{name:"Whitney Houston",year:1963,role:"Singer"},{name:"Gillian Anderson",year:1968,role:"Actress"},{name:"Anna Kendrick",year:1985,role:"Actress"}],
  "august-10":[{name:"Kylie Jenner",year:1997,role:"Businesswoman and TV Personality"},{name:"Antonio Banderas",year:1960,role:"Actor"},{name:"Riddick Bowe",year:1967,role:"Boxing Champion"}],
  "august-11":[{name:"Chris Hemsworth",year:1983,role:"Actor"},{name:"Hulk Hogan",year:1953,role:"Wrestling Legend"},{name:"Steve Wozniak",year:1950,role:"Apple Co-Founder"}],
  "august-12":[{name:"Pete Sampras",year:1971,role:"Tennis Legend"},{name:"George Hamilton",year:1939,role:"Actor"},{name:"Casey Affleck",year:1975,role:"Actor"}],
  "august-13":[{name:"Alfred Hitchcock",year:1899,role:"Master of Suspense Director"},{name:"Fidel Castro",year:1926,role:"Cuban Leader"},{name:"Sebastian Stan",year:1982,role:"Actor"}],
  "august-14":[{name:"Halle Berry",year:1966,role:"Actress"},{name:"Magic Johnson",year:1959,role:"Basketball Legend"},{name:"Mila Kunis",year:1983,role:"Actress"}],
  "august-15":[{name:"Napoleon Bonaparte",year:1769,role:"French Emperor"},{name:"Ben Affleck",year:1972,role:"Actor and Director"},{name:"Jennifer Lawrence",year:1990,role:"Actress"}],
  "august-16":[{name:"Madonna",year:1958,role:"Pop Queen"},{name:"Steve Carell",year:1962,role:"Actor and Comedian"},{name:"Angela Bassett",year:1958,role:"Actress"}],
  "august-17":[{name:"Robert De Niro",year:1943,role:"Actor"},{name:"Sean Penn",year:1960,role:"Actor and Director"},{name:"Donnie Wahlberg",year:1969,role:"Actor and Singer"}],
  "august-18":[{name:"Christian Slater",year:1969,role:"Actor"},{name:"Edward Norton",year:1969,role:"Actor"},{name:"Patrick Swayze",year:1952,role:"Actor"}],
  "august-19":[{name:"Bill Clinton",year:1946,role:"42nd US President"},{name:"John Stamos",year:1963,role:"Actor"},{name:"Coco Chanel",year:1883,role:"Fashion Designer"}],
  "august-20":[{name:"Robert Plant",year:1948,role:"Led Zeppelin Singer"},{name:"Amy Adams",year:1974,role:"Actress"},{name:"Demi Lovato",year:1992,role:"Singer and Actress"}],
  "august-21":[{name:"Hayden Christensen",year:1981,role:"Actor"},{name:"Kenny Rogers",year:1938,role:"Country Singer"},{name:"Usain Bolt",year:1986,role:"Olympic Sprint Champion"}],
  "august-22":[{name:"James Corden",year:1978,role:"TV Host and Comedian"},{name:"Tori Amos",year:1963,role:"Singer and Pianist"},{name:"Cindy Williams",year:1947,role:"Actress"}],
  "august-23":[{name:"Kobe Bryant",year:1978,role:"Basketball Legend"},{name:"River Phoenix",year:1970,role:"Actor"},{name:"Shelley Long",year:1949,role:"Actress"}],
  "august-24":[{name:"Rupert Grint",year:1988,role:"Actor"},{name:"Steve Martin",year:1945,role:"Comedian and Actor"},{name:"Dave Chappelle",year:1973,role:"Comedian"}],
  "august-25":[{name:"Sean Connery",year:1930,role:"Actor and James Bond"},{name:"Blake Lively",year:1987,role:"Actress"},{name:"Tim Burton",year:1958,role:"Director"}],
  "august-26":[{name:"Macaulay Culkin",year:1980,role:"Actor"},{name:"Melissa McCarthy",year:1970,role:"Actress and Comedian"},{name:"Mother Teresa",year:1910,role:"Nobel Peace Prize Winner"}],
  "august-27":[{name:"Aaron Paul",year:1979,role:"Actor"},{name:"Lyndon B. Johnson",year:1908,role:"36th US President"},{name:"Chandra Wilson",year:1969,role:"Actress"}],
  "august-28":[{name:"Jack Black",year:1969,role:"Actor and Comedian"},{name:"Jason Priestley",year:1969,role:"Actor"},{name:"Shania Twain",year:1965,role:"Country Singer"}],
  "august-29":[{name:"Michael Jackson",year:1958,role:"King of Pop"},{name:"Ingrid Bergman",year:1915,role:"Actress"},{name:"Lea Michele",year:1986,role:"Actress and Singer"}],
  "august-30":[{name:"Cameron Diaz",year:1972,role:"Actress"},{name:"Warren Buffett",year:1930,role:"Legendary Investor"},{name:"Peggy Lipton",year:1946,role:"Actress"}],
  "august-31":[{name:"Richard Gere",year:1949,role:"Actor"},{name:"Chris Tucker",year:1971,role:"Comedian and Actor"},{name:"Van Morrison",year:1945,role:"Rock Singer"}],
  "september-1":[{name:"Dr. Phil",year:1950,role:"TV Host and Psychologist"},{name:"Barry Gibb",year:1946,role:"Bee Gees Singer"},{name:"Gloria Estefan",year:1957,role:"Singer"}],
  "september-2":[{name:"Keanu Reeves",year:1964,role:"Actor"},{name:"Salma Hayek",year:1966,role:"Actress"},{name:"Mark Harmon",year:1951,role:"Actor"}],
  "september-3":[{name:"Charlie Sheen",year:1965,role:"Actor"},{name:"Shaun White",year:1986,role:"Olympic Snowboarder"},{name:"Malcolm Gladwell",year:1963,role:"Author"}],
  "september-4":[{name:"Beyonce",year:1981,role:"Queen Bey"},{name:"Damon Wayans",year:1960,role:"Comedian and Actor"},{name:"Mark Ronson",year:1975,role:"DJ and Producer"}],
  "september-5":[{name:"Freddie Mercury",year:1946,role:"Queen Lead Singer"},{name:"Michael Keaton",year:1951,role:"Actor"},{name:"Rose McGowan",year:1973,role:"Actress"}],
  "september-6":[{name:"Idris Elba",year:1972,role:"Actor"},{name:"Swoosie Kurtz",year:1944,role:"Actress"},{name:"Jeff Foxworthy",year:1958,role:"Comedian"}],
  "september-7":[{name:"Evan Rachel Wood",year:1987,role:"Actress"},{name:"Corbin Bleu",year:1989,role:"Actor"},{name:"Leslie Jones",year:1967,role:"Comedian and Actress"}],
  "september-8":[{name:"Pink",year:1979,role:"Singer"},{name:"David Arquette",year:1971,role:"Actor"},{name:"Martin Freeman",year:1971,role:"Actor"}],
  "september-9":[{name:"Adam Sandler",year:1966,role:"Comedian and Actor"},{name:"Michael Buble",year:1975,role:"Singer"},{name:"Hugh Grant",year:1960,role:"Actor"}],
  "september-10":[{name:"Colin Firth",year:1960,role:"Actor"},{name:"Karl Lagerfeld",year:1933,role:"Fashion Designer"},{name:"Ryan Phillippe",year:1974,role:"Actor"}],
  "september-11":[{name:"Harry Connick Jr.",year:1967,role:"Singer and Actor"},{name:"Taraji P. Henson",year:1970,role:"Actress"},{name:"Ludacris",year:1977,role:"Rapper and Actor"}],
  "september-12":[{name:"Jennifer Hudson",year:1981,role:"Singer and Actress"},{name:"Paul Walker",year:1973,role:"Actor"},{name:"Emmy Rossum",year:1986,role:"Actress"}],
  "september-13":[{name:"Roald Dahl",year:1916,role:"Children's Author"},{name:"Fiona Apple",year:1977,role:"Singer"},{name:"Ben Savage",year:1980,role:"Actor"}],
  "september-14":[{name:"Amy Winehouse",year:1983,role:"Singer"},{name:"Sam Neill",year:1947,role:"Actor"},{name:"Andrew Lincoln",year:1973,role:"Actor"}],
  "september-15":[{name:"Prince Harry",year:1984,role:"Duke of Sussex"},{name:"Tommy Lee Jones",year:1946,role:"Actor"},{name:"Agatha Christie",year:1890,role:"Mystery Author"}],
  "september-16":[{name:"Marc Anthony",year:1968,role:"Singer"},{name:"B.B. King",year:1925,role:"Blues Legend"},{name:"Nick Jonas",year:1992,role:"Singer"}],
  "september-17":[{name:"Hank Williams Jr.",year:1949,role:"Country Singer"},{name:"Kyle Chandler",year:1965,role:"Actor"},{name:"Graydon Carter",year:1949,role:"Vanity Fair Editor"}],
  "september-18":[{name:"Jada Pinkett Smith",year:1971,role:"Actress"},{name:"James Gandolfini",year:1961,role:"Actor"},{name:"Lance Armstrong",year:1971,role:"Cyclist"}],
  "september-19":[{name:"Jimmy Fallon",year:1974,role:"TV Host and Comedian"},{name:"Jeremy Irons",year:1948,role:"Actor"},{name:"Trisha Yearwood",year:1964,role:"Country Singer"}],
  "september-20":[{name:"Sophia Loren",year:1934,role:"Actress"},{name:"Jon Bernthal",year:1976,role:"Actor"},{name:"Gary Cole",year:1956,role:"Actor"}],
  "september-21":[{name:"Stephen King",year:1947,role:"Horror Author"},{name:"Bill Murray",year:1950,role:"Comedian and Actor"},{name:"Liam Gallagher",year:1972,role:"Oasis Singer"}],
  "september-22":[{name:"Tom Felton",year:1987,role:"Actor"},{name:"Bonnie Hunt",year:1961,role:"Actress"},{name:"Andrea Bocelli",year:1958,role:"Opera Singer"}],
  "september-23":[{name:"Bruce Springsteen",year:1949,role:"The Boss"},{name:"Ray Charles",year:1930,role:"Music Legend"},{name:"Jason Alexander",year:1959,role:"Actor"}],
  "september-24":[{name:"F. Scott Fitzgerald",year:1896,role:"Great Gatsby Author"},{name:"Kevin Sorbo",year:1958,role:"Actor"},{name:"Nia Vardalos",year:1962,role:"Actress and Writer"}],
  "september-25":[{name:"Will Smith",year:1968,role:"Actor and Rapper"},{name:"Heather Locklear",year:1961,role:"Actress"},{name:"Catherine Zeta-Jones",year:1969,role:"Actress"}],
  "september-26":[{name:"Serena Williams",year:1981,role:"Tennis Champion"},{name:"Olivia Newton-John",year:1948,role:"Singer and Actress"},{name:"T.S. Eliot",year:1888,role:"Nobel Prize Winning Poet"}],
  "september-27":[{name:"Gwyneth Paltrow",year:1972,role:"Actress"},{name:"Lil Wayne",year:1982,role:"Rapper"},{name:"Meat Loaf",year:1947,role:"Rock Singer"}],
  "september-28":[{name:"Confucius",year:551,role:"Chinese Philosopher"},{name:"Naomi Watts",year:1968,role:"Actress"},{name:"Hilary Duff",year:1987,role:"Actress and Singer"}],
  "september-29":[{name:"Halsey",year:1994,role:"Singer"},{name:"Kevin Durant",year:1988,role:"NBA Champion"},{name:"Lena Headey",year:1973,role:"Actress"}],
  "september-30":[{name:"Martina Hingis",year:1980,role:"Tennis Champion"},{name:"Truman Capote",year:1924,role:"Author"},{name:"Marion Cotillard",year:1975,role:"Actress"}],
  "october-1":[{name:"Brie Larson",year:1989,role:"Actress"},{name:"Jimmy Carter",year:1924,role:"39th US President"},{name:"Zach Galifianakis",year:1969,role:"Comedian and Actor"}],
  "october-2":[{name:"Mahatma Gandhi",year:1869,role:"Indian Independence Leader"},{name:"Sting",year:1951,role:"The Police Singer"},{name:"Kelly Ripa",year:1970,role:"TV Host"}],
  "october-3":[{name:"Gwen Stefani",year:1969,role:"Singer"},{name:"Clive Owen",year:1964,role:"Actor"},{name:"Ashlee Simpson",year:1984,role:"Singer"}],
  "october-4":[{name:"Alicia Silverstone",year:1976,role:"Actress"},{name:"Melissa Benoist",year:1988,role:"Actress"},{name:"Charlton Heston",year:1923,role:"Actor"}],
  "october-5":[{name:"Kate Winslet",year:1975,role:"Actress"},{name:"Jesse Eisenberg",year:1983,role:"Actor"},{name:"Bob Geldof",year:1951,role:"Musician and Activist"}],
  "october-6":[{name:"Elisabeth Shue",year:1963,role:"Actress"},{name:"Ioan Gruffudd",year:1973,role:"Actor"},{name:"Jeremy Sisto",year:1974,role:"Actor"}],
  "october-7":[{name:"Vladimir Putin",year:1952,role:"Russian President"},{name:"Simon Cowell",year:1959,role:"TV Judge and Producer"},{name:"Thom Yorke",year:1968,role:"Radiohead Singer"}],
  "october-8":[{name:"Matt Damon",year:1970,role:"Actor"},{name:"Bruno Mars",year:1985,role:"Singer"},{name:"Chevy Chase",year:1943,role:"Comedian and Actor"}],
  "october-9":[{name:"John Lennon",year:1940,role:"Beatle"},{name:"Sharon Osbourne",year:1952,role:"TV Personality"},{name:"Tyler James Williams",year:1992,role:"Actor"}],
  "october-10":[{name:"David Lee Roth",year:1954,role:"Van Halen Singer"},{name:"Brett Favre",year:1969,role:"NFL Hall of Famer"},{name:"Dale Earnhardt Jr.",year:1974,role:"NASCAR Driver"}],
  "october-11":[{name:"Michelle Pfeiffer",year:1958,role:"Actress"},{name:"Luke Perry",year:1966,role:"Actor"},{name:"Cardi B",year:1992,role:"Rapper"}],
  "october-12":[{name:"Hugh Jackman",year:1968,role:"Actor"},{name:"Kirk Cameron",year:1970,role:"Actor"},{name:"Marion Jones",year:1975,role:"Olympic Sprinter"}],
  "october-13":[{name:"Sacha Baron Cohen",year:1971,role:"Comedian and Actor"},{name:"Paul Simon",year:1941,role:"Singer and Songwriter"},{name:"Nancy Kerrigan",year:1969,role:"Olympic Figure Skater"}],
  "october-14":[{name:"Usher",year:1978,role:"Singer and Dancer"},{name:"Roger Moore",year:1927,role:"Actor and James Bond"},{name:"Dwight Eisenhower",year:1890,role:"34th US President"}],
  "october-15":[{name:"Emeril Lagasse",year:1959,role:"Celebrity Chef"},{name:"Sarah Ferguson",year:1959,role:"Duchess of York"},{name:"Tanya Tucker",year:1958,role:"Country Singer"}],
  "october-16":[{name:"John Mayer",year:1977,role:"Singer and Guitarist"},{name:"Oscar Wilde",year:1854,role:"Playwright and Author"},{name:"Angela Lansbury",year:1925,role:"Actress"}],
  "october-17":[{name:"Eminem",year:1972,role:"Rap Legend"},{name:"Evel Knievel",year:1938,role:"Stuntman"},{name:"Felicity Jones",year:1983,role:"Actress"}],
  "october-18":[{name:"Zac Efron",year:1987,role:"Actor"},{name:"Chuck Berry",year:1926,role:"Rock and Roll Pioneer"},{name:"Jean-Claude Van Damme",year:1960,role:"Actor and Martial Artist"}],
  "october-19":[{name:"John Lithgow",year:1945,role:"Actor"},{name:"Jon Favreau",year:1966,role:"Director and Actor"},{name:"Gillian Jacobs",year:1982,role:"Actress"}],
  "october-20":[{name:"Snoop Dogg",year:1971,role:"Rapper"},{name:"Tom Petty",year:1950,role:"Rock Legend"},{name:"Viggo Mortensen",year:1958,role:"Actor"}],
  "october-21":[{name:"Kim Kardashian",year:1980,role:"Media Personality"},{name:"Carrie Fisher",year:1956,role:"Actress"},{name:"Judge Judy",year:1942,role:"TV Judge"}],
  "october-22":[{name:"Jeff Goldblum",year:1952,role:"Actor"},{name:"Deepak Chopra",year:1946,role:"Author and Speaker"},{name:"Brian Boitano",year:1963,role:"Olympic Figure Skater"}],
  "october-23":[{name:"Ryan Reynolds",year:1976,role:"Actor"},{name:"Johnny Carson",year:1925,role:"TV Host"},{name:"Pele",year:1940,role:"Football Legend"}],
  "october-24":[{name:"Drake",year:1986,role:"Rapper and Singer"},{name:"Kevin Kline",year:1947,role:"Actor"},{name:"B-Real",year:1970,role:"Cypress Hill Rapper"}],
  "october-25":[{name:"Katy Perry",year:1984,role:"Singer"},{name:"Pablo Picasso",year:1881,role:"Cubist Artist"},{name:"Chad Smith",year:1961,role:"Red Hot Chili Peppers Drummer"}],
  "october-26":[{name:"Hillary Clinton",year:1947,role:"Former US Secretary of State"},{name:"Dylan McDermott",year:1961,role:"Actor"},{name:"Seth MacFarlane",year:1973,role:"Family Guy Creator"}],
  "october-27":[{name:"John Cleese",year:1939,role:"Monty Python Comedian"},{name:"Simon Le Bon",year:1958,role:"Duran Duran Singer"},{name:"Kelly Osbourne",year:1984,role:"TV Personality"}],
  "october-28":[{name:"Joaquin Phoenix",year:1974,role:"Actor"},{name:"Bill Gates",year:1955,role:"Microsoft Founder"},{name:"Julia Roberts",year:1967,role:"Actress"}],
  "october-29":[{name:"Winona Ryder",year:1971,role:"Actress"},{name:"Richard Dreyfuss",year:1947,role:"Actor"},{name:"Dan Foster",year:1968,role:"TV Host"}],
  "october-30":[{name:"Henry Winkler",year:1945,role:"Actor"},{name:"Diego Maradona",year:1960,role:"Football Legend"},{name:"Gavin Rossdale",year:1965,role:"Bush Singer"}],
  "october-31":[{name:"Vanilla Ice",year:1967,role:"Rapper"},{name:"Willow Smith",year:2000,role:"Singer and Actress"},{name:"Rob Schneider",year:1963,role:"Comedian and Actor"}],
  "november-1":[{name:"Penn Badgley",year:1986,role:"Actor"},{name:"Larry Flynt",year:1942,role:"Publisher"},{name:"Aishwarya Rai",year:1973,role:"Actress and Miss World"}],
  "november-2":[{name:"k.d. lang",year:1961,role:"Singer"},{name:"Marie Antoinette",year:1755,role:"Queen of France"},{name:"David Schwimmer",year:1966,role:"Actor"}],
  "november-3":[{name:"Kendall Jenner",year:1995,role:"Model and TV Personality"},{name:"Adam Ant",year:1954,role:"Rock Singer"},{name:"Roseanne Barr",year:1952,role:"Comedian and Actress"}],
  "november-4":[{name:"Matthew McConaughey",year:1969,role:"Actor"},{name:"Sean Combs",year:1969,role:"Rapper and Producer"},{name:"Laura Bush",year:1946,role:"Former First Lady"}],
  "november-5":[{name:"Bryan Adams",year:1959,role:"Rock Singer"},{name:"Tatum O'Neal",year:1963,role:"Actress"},{name:"Sam Rockwell",year:1968,role:"Actor"}],
  "november-6":[{name:"Ethan Hawke",year:1970,role:"Actor and Director"},{name:"Sally Field",year:1946,role:"Actress"},{name:"Emma Stone",year:1988,role:"Actress"}],
  "november-7":[{name:"Marie Curie",year:1867,role:"Nobel Prize Winning Scientist"},{name:"Joni Mitchell",year:1943,role:"Singer and Songwriter"},{name:"David Guetta",year:1967,role:"DJ and Producer"}],
  "november-8":[{name:"Gordon Ramsay",year:1966,role:"Celebrity Chef"},{name:"Tara Reid",year:1975,role:"Actress"},{name:"Bonnie Raitt",year:1949,role:"Singer and Guitarist"}],
  "november-9":[{name:"Carl Sagan",year:1934,role:"Astronomer and Author"},{name:"Nick Lachey",year:1973,role:"Singer"},{name:"Lou Ferrigno",year:1951,role:"Actor and Bodybuilder"}],
  "november-10":[{name:"Miranda Lambert",year:1983,role:"Country Singer"},{name:"Neil Young",year:1945,role:"Rock Legend"},{name:"Sinbad",year:1956,role:"Comedian"}],
  "november-11":[{name:"Leonardo DiCaprio",year:1974,role:"Actor"},{name:"Demi Moore",year:1962,role:"Actress"},{name:"Stanley Tucci",year:1960,role:"Actor"}],
  "november-12":[{name:"Ryan Gosling",year:1980,role:"Actor"},{name:"Anne Hathaway",year:1982,role:"Actress"},{name:"Tonya Harding",year:1970,role:"Figure Skater"}],
  "november-13":[{name:"Gerard Butler",year:1969,role:"Actor"},{name:"Whoopi Goldberg",year:1955,role:"Actress and TV Host"},{name:"Jimmy Kimmel",year:1967,role:"TV Host"}],
  "november-14":[{name:"Prince Charles",year:1948,role:"King of England"},{name:"Claude Monet",year:1840,role:"Impressionist Painter"},{name:"Condoleezza Rice",year:1954,role:"Former US Secretary of State"}],
  "november-15":[{name:"Chad Kroeger",year:1974,role:"Nickelback Singer"},{name:"Shailene Woodley",year:1991,role:"Actress"},{name:"Georgia O'Keeffe",year:1887,role:"Painter"}],
  "november-16":[{name:"Burgess Meredith",year:1907,role:"Actor"},{name:"Maggie Gyllenhaal",year:1977,role:"Actress"},{name:"Dwight Gooden",year:1964,role:"Baseball Pitcher"}],
  "november-17":[{name:"Rachel McAdams",year:1978,role:"Actress"},{name:"Martin Scorsese",year:1942,role:"Film Director"},{name:"Lorde",year:1996,role:"Singer"}],
  "november-18":[{name:"Owen Wilson",year:1968,role:"Actor"},{name:"Gary Coleman",year:1968,role:"Actor"},{name:"Chloe Sevigny",year:1974,role:"Actress"}],
  "november-19":[{name:"Jodie Foster",year:1962,role:"Actress and Director"},{name:"Meg Ryan",year:1961,role:"Actress"},{name:"Calvin Klein",year:1942,role:"Fashion Designer"}],
  "november-20":[{name:"Joe Biden",year:1942,role:"46th US President"},{name:"Demi Lovato",year:1992,role:"Singer"},{name:"Duane Allman",year:1946,role:"Allman Brothers Guitarist"}],
  "november-21":[{name:"Goldie Hawn",year:1945,role:"Actress"},{name:"Ken Griffey Jr.",year:1969,role:"Baseball Legend"},{name:"Bjork",year:1965,role:"Singer"}],
  "november-22":[{name:"Scarlett Johansson",year:1984,role:"Actress"},{name:"Mark Ruffalo",year:1967,role:"Actor"},{name:"Jamie Lee Curtis",year:1958,role:"Actress"}],
  "november-23":[{name:"Miley Cyrus",year:1992,role:"Singer and Actress"},{name:"Billy the Kid",year:1859,role:"American Outlaw"},{name:"Nicole Richie",year:1981,role:"TV Personality"}],
  "november-24":[{name:"Katherine Heigl",year:1978,role:"Actress"},{name:"Arundhati Roy",year:1961,role:"Author"},{name:"Sarah Hyland",year:1990,role:"Actress"}],
  "november-25":[{name:"Christina Applegate",year:1971,role:"Actress"},{name:"John F. Kennedy Jr.",year:1960,role:"Lawyer and Publisher"},{name:"Amy Grant",year:1960,role:"Singer"}],
  "november-26":[{name:"Tina Turner",year:1939,role:"Rock Queen"},{name:"Charles Schulz",year:1922,role:"Peanuts Creator"},{name:"DJ Qualls",year:1978,role:"Actor"}],
  "november-27":[{name:"Jimi Hendrix",year:1942,role:"Guitar Legend"},{name:"Bruce Lee",year:1940,role:"Martial Arts Legend"},{name:"Robin Givens",year:1964,role:"Actress"}],
  "november-28":[{name:"Jon Stewart",year:1962,role:"TV Host and Comedian"},{name:"Ed Harris",year:1950,role:"Actor"},{name:"Judd Nelson",year:1959,role:"Actor"}],
  "november-29":[{name:"C.S. Lewis",year:1898,role:"Narnia Author"},{name:"Chadwick Boseman",year:1976,role:"Actor"},{name:"Mariano Rivera",year:1969,role:"Baseball Legend"}],
  "november-30":[{name:"Mark Twain",year:1835,role:"Author of Huck Finn"},{name:"Ben Stiller",year:1965,role:"Actor and Director"},{name:"Billy Idol",year:1955,role:"Rock Singer"}],
  "december-1":[{name:"Woody Allen",year:1935,role:"Director and Comedian"},{name:"Sarah Silverman",year:1970,role:"Comedian"},{name:"Bette Midler",year:1945,role:"Singer and Actress"}],
  "december-2":[{name:"Britney Spears",year:1981,role:"Pop Princess"},{name:"Lucy Liu",year:1968,role:"Actress"},{name:"Nelly Furtado",year:1978,role:"Singer"}],
  "december-3":[{name:"Julianne Moore",year:1960,role:"Actress"},{name:"Ozzy Osbourne",year:1948,role:"Rock Legend"},{name:"Brendan Fraser",year:1968,role:"Actor"}],
  "december-4":[{name:"Jay-Z",year:1969,role:"Rapper and Businessman"},{name:"Tyra Banks",year:1973,role:"Supermodel and TV Host"},{name:"Jeff Bridges",year:1949,role:"Actor"}],
  "december-5":[{name:"Walt Disney",year:1901,role:"Animation Pioneer"},{name:"Jim Plunkett",year:1947,role:"NFL Quarterback"},{name:"Margaret Cho",year:1968,role:"Comedian"}],
  "december-6":[{name:"Steven Wright",year:1955,role:"Comedian"},{name:"Craig Brewer",year:1971,role:"Director"},{name:"Agnes Moorehead",year:1900,role:"Actress"}],
  "december-7":[{name:"Tom Waits",year:1949,role:"Singer and Songwriter"},{name:"Aaron Carter",year:1987,role:"Singer"},{name:"Larry Bird",year:1956,role:"Basketball Legend"}],
  "december-8":[{name:"Nicki Minaj",year:1982,role:"Rapper"},{name:"Kim Basinger",year:1953,role:"Actress"},{name:"Sinead O'Connor",year:1966,role:"Singer"}],
  "december-9":[{name:"John Malkovich",year:1953,role:"Actor"},{name:"Judi Dench",year:1934,role:"Actress"},{name:"Kirk Douglas",year:1916,role:"Actor"}],
  "december-10":[{name:"Kenneth Branagh",year:1960,role:"Actor and Director"},{name:"Emily Dickinson",year:1830,role:"Poet"},{name:"Raven-Symone",year:1985,role:"Actress"}],
  "december-11":[{name:"Brenda Lee",year:1944,role:"Singer"},{name:"Teri Garr",year:1944,role:"Actress"},{name:"Rider Strong",year:1979,role:"Actor"}],
  "december-12":[{name:"Jennifer Connelly",year:1970,role:"Actress"},{name:"Bob Barker",year:1923,role:"TV Host"},{name:"Frank Sinatra",year:1915,role:"Rat Pack Legend"}],
  "december-13":[{name:"Taylor Swift",year:1989,role:"Singer and Songwriter"},{name:"Jamie Foxx",year:1967,role:"Actor and Singer"},{name:"Steve Buscemi",year:1957,role:"Actor"}],
  "december-14":[{name:"Nostradamus",year:1503,role:"French Astrologer and Seer"},{name:"Vanessa Hudgens",year:1988,role:"Actress"},{name:"Miranda Hart",year:1972,role:"Comedian and Actress"}],
  "december-15":[{name:"Don Johnson",year:1949,role:"Actor"},{name:"Adam Brody",year:1979,role:"Actor"},{name:"Tim Conway",year:1933,role:"Comedian"}],
  "december-16":[{name:"Jane Austen",year:1775,role:"Author of Pride and Prejudice"},{name:"Benjamin Bratt",year:1963,role:"Actor"},{name:"Miranda Otto",year:1967,role:"Actress"}],
  "december-17":[{name:"Milla Jovovich",year:1975,role:"Actress"},{name:"Bill Pullman",year:1953,role:"Actor"},{name:"Pope Francis",year:1936,role:"Catholic Pope"}],
  "december-18":[{name:"Brad Pitt",year:1963,role:"Actor"},{name:"Billie Eilish",year:2001,role:"Singer"},{name:"Steven Spielberg",year:1946,role:"Director"}],
  "december-19":[{name:"Jake Gyllenhaal",year:1980,role:"Actor"},{name:"Alyssa Milano",year:1972,role:"Actress"},{name:"Edith Piaf",year:1915,role:"French Singer"}],
  "december-20":[{name:"Uri Geller",year:1946,role:"Illusionist"},{name:"Harvey Fierstein",year:1952,role:"Actor and Playwright"},{name:"Jonah Hill",year:1983,role:"Actor and Comedian"}],
  "december-21":[{name:"Samuel L. Jackson",year:1948,role:"Actor"},{name:"Jane Fonda",year:1937,role:"Actress"},{name:"Kiefer Sutherland",year:1966,role:"Actor"}],
  "december-22":[{name:"Meghan Trainor",year:1993,role:"Singer"},{name:"Ralph Fiennes",year:1962,role:"Actor"},{name:"Maurice Gibb",year:1949,role:"Bee Gees Singer"}],
  "december-23":[{name:"Eddie Vedder",year:1964,role:"Pearl Jam Singer"},{name:"Corey Haim",year:1971,role:"Actor"},{name:"Carla Bruni",year:1967,role:"Singer and Former First Lady"}],
  "december-24":[{name:"Ryan Seacrest",year:1974,role:"TV Host"},{name:"Louis Tomlinson",year:1991,role:"One Direction Singer"},{name:"Ricky Martin",year:1971,role:"Singer"}],
  "december-25":[{name:"Isaac Newton",year:1643,role:"Mathematician and Physicist"},{name:"Jimmy Buffett",year:1946,role:"Singer"},{name:"Justin Trudeau",year:1971,role:"Canadian Prime Minister"}],
  "december-26":[{name:"Jared Leto",year:1971,role:"Actor and Singer"},{name:"Ozzie Smith",year:1954,role:"Baseball Hall of Famer"},{name:"Carlton Fisk",year:1947,role:"Baseball Hall of Famer"}],
  "december-27":[{name:"Timothee Chalamet",year:1995,role:"Actor"},{name:"Marlene Dietrich",year:1901,role:"Actress"},{name:"Gerard Depardieu",year:1948,role:"Actor"}],
  "december-28":[{name:"Denzel Washington",year:1954,role:"Actor"},{name:"John Legend",year:1978,role:"Singer"},{name:"Stan Lee",year:1922,role:"Marvel Comics Creator"}],
  "december-29":[{name:"Jude Law",year:1972,role:"Actor"},{name:"Mary Tyler Moore",year:1936,role:"Actress"},{name:"Marianne Faithfull",year:1946,role:"Singer"}],
  "december-30":[{name:"Tiger Woods",year:1975,role:"Golf Legend"},{name:"LeBron James",year:1984,role:"Basketball Legend"},{name:"Eliza Dushku",year:1980,role:"Actress"}],
  "december-31":[{name:"Anthony Hopkins",year:1937,role:"Actor"},{name:"Psy",year:1977,role:"Gangnam Style Singer"},{name:"Val Kilmer",year:1959,role:"Actor"}],
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const MONTH_SLUG = ["january","february","march","april","may","june",
  "july","august","september","october","november","december"];
const MAX_DAYS = [31,29,31,30,31,30,31,31,30,31,30,31];

const POPULAR_DATES = [
  { label:"Jan 1",  month:1,  day:1  },
  { label:"Feb 14", month:2,  day:14 },
  { label:"Mar 17", month:3,  day:17 },
  { label:"Jul 4",  month:7,  day:4  },
  { label:"Oct 31", month:10, day:31 },
  { label:"Dec 25", month:12, day:25 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStarSign(month: number, day: number): string {
  if ((month===3&&day>=21)||(month===4&&day<=19)) return "♈ Aries";
  if ((month===4&&day>=20)||(month===5&&day<=20)) return "♉ Taurus";
  if ((month===5&&day>=21)||(month===6&&day<=20)) return "♊ Gemini";
  if ((month===6&&day>=21)||(month===7&&day<=22)) return "♋ Cancer";
  if ((month===7&&day>=23)||(month===8&&day<=22)) return "♌ Leo";
  if ((month===8&&day>=23)||(month===9&&day<=22)) return "♍ Virgo";
  if ((month===9&&day>=23)||(month===10&&day<=22)) return "♎ Libra";
  if ((month===10&&day>=23)||(month===11&&day<=21)) return "♏ Scorpio";
  if ((month===11&&day>=22)||(month===12&&day<=21)) return "♐ Sagittarius";
  if ((month===12&&day>=22)||(month===1&&day<=19)) return "♑ Capricorn";
  if ((month===1&&day>=20)||(month===2&&day<=18)) return "♒ Aquarius";
  return "♓ Pisces";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BirthdayTwinsTool() {
  const [month,   setMonth]   = useState(1);
  const [day,     setDay]     = useState(1);
  const [searched,setSearched]= useState(false);
  const [urlDateParam, setUrlDateParam] = useState<string | null>(null);

  // On mount, check for ?date=YYYY-MM-DD and auto-load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    if (dateParam) {
      // Parse YYYY-MM-DD
      const parts = dateParam.split("-");
      if (parts.length >= 3) {
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
          setMonth(m);
          setDay(d);
          setSearched(true);
          setUrlDateParam(dateParam);
        }
      }
    }
  }, []);

  const safeDay   = Math.min(day, MAX_DAYS[month - 1]);
  const key       = `${MONTH_SLUG[month - 1]}-${safeDay}`;
  const people    = DB[key] ?? [];
  const dateLabel = `${MONTHS[month - 1]} ${safeDay}`;
  const currentYear = new Date().getFullYear();
  const sign      = getStarSign(month, safeDay);

  // Build share URL with encoded date
  const shareDateParam = `${new Date().getFullYear()}-${String(month).padStart(2,"0")}-${String(safeDay).padStart(2,"0")}`;
  const shareUrl = `https://dayblip.com/birthday-twins?date=${shareDateParam}`;

  // Update browser URL when user searches (without full navigation)
  const pushAndSearch = (m: number, d: number) => {
    const safe = Math.min(d, MAX_DAYS[m - 1]);
    if (typeof window !== "undefined") {
      const dateStr = `${new Date().getFullYear()}-${String(m).padStart(2,"0")}-${String(safe).padStart(2,"0")}`;
      window.history.pushState({}, "", `/birthday-twins?date=${dateStr}`);
    }
    setMonth(m);
    setDay(d);
    setSearched(true);
  };

  const handleSearch = () => pushAndSearch(month, safeDay);


  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎂</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Birthday Twin Finder</h1>
          <p className="text-lg text-[#a8a8b3]">Discover famous people who share your birthday</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">

            <label className="mb-3 block text-sm font-semibold text-white">
              Select your birth month and day
            </label>
            <div className="flex gap-3 mb-4">
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select value={safeDay} onChange={e => setDay(Number(e.target.value))}
                className="w-24 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {Array.from({ length: MAX_DAYS[month - 1] }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Popular date pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              {POPULAR_DATES.map(pd => (
                <button key={pd.label}
                  onClick={() => pushAndSearch(pd.month, pd.day)}
                  className="rounded-full border border-[#0f3460] bg-[#16213e] px-3 py-1 text-xs text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white">
                  {pd.label}
                </button>
              ))}
            </div>

            <button onClick={handleSearch}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Find My Birthday Twins →
            </button>
          </div>

          {/* Results — instant from database */}
          {searched && urlDateParam && (
            <div className="mt-4 rounded-lg border border-[#4FC3F7]/30 bg-[#4FC3F7]/10 px-4 py-2 text-sm text-[#4FC3F7]">
              Showing birthday twins for <strong>{dateLabel}</strong> — enter your own birthday below to find yours!
            </div>
          )}
          {searched && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">
                  Famous people born on {dateLabel}:
                </h2>
                <span className="rounded-full bg-[#e94560]/10 border border-[#e94560]/30 px-3 py-0.5 text-xs text-[#e94560]">
                  {sign}
                </span>
              </div>

              {people.length === 0 ? (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                  <p className="text-[#a8a8b3] mb-4">We are still adding celebrities for this date. Try another date!</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_DATES.map(pd => (
                      <button key={pd.label}
                        onClick={() => pushAndSearch(pd.month, pd.day)}
                        className="rounded-full border border-[#0f3460] px-4 py-1.5 text-sm text-[#a8a8b3] hover:border-[#e94560] hover:text-white transition-colors">
                        {pd.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {people.map((p, i) => (
                      <div key={i} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                        <p className="font-bold text-white text-lg">{p.name}</p>
                        <p className="text-[#a8a8b3] text-sm mt-1">{p.role}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[#e94560] font-semibold text-sm">Born {p.year}</span>
                          <span className="text-[#a8a8b3] text-xs">{currentYear - p.year} years ago</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <ShareButtons
                    text={people.length >= 2
                      ? `My birthday twins are ${people.slice(0,3).map(p=>p.name).join(", ")}! We all share ${dateLabel} as our birthday! Find yours!`
                      : `Find famous people who share your ${dateLabel} birthday!`}
                    url={shareUrl}
                    title="Birthday Twin Finder"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#1a1a2e] px-6 py-12">
        <div className="mx-auto max-w-[700px]">
          {/* Cluster mesh block — do not remove */}
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', margin: '0 0 32px 0' }}>
            <p style={{ color: '#a8a8b3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Explore Your Story</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="/born-in" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🌍 Born In Your Year</a>
              <a href="/tools/life-in-weeks" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>📅 Life in Weeks</a>
              <a href="/tools/generation-quiz" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🧬 What Generation Am I?</a>
              <a href="/number-one-song" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎵 #1 Song on Your Birthday</a>
            </div>
          </div>
          <RelatedTools tools={[
            { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
            { emoji: "📅", title: "Life in Weeks", desc: "See your entire life as a grid of weeks", href: "/tools/life-in-weeks" },
            { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
            { emoji: "🎵", title: "#1 Song on Your Birthday", desc: "Discover the hit song from your birth year", href: "/number-one-song" },
          ]} />
        </div>
      </section>
    </div>
  );
}
