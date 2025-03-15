--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asteroid; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.asteroid (
    asteroid_id integer NOT NULL,
    name character varying(50) NOT NULL,
    diameter_km integer NOT NULL,
    is_near_earth boolean,
    is_potentially_hazardous boolean DEFAULT false,
    discovery_year integer,
    composition text
);


ALTER TABLE public.asteroid OWNER TO freecodecamp;

--
-- Name: asteroid_asteroid_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.asteroid_asteroid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asteroid_asteroid_id_seq OWNER TO freecodecamp;

--
-- Name: asteroid_asteroid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.asteroid_asteroid_id_seq OWNED BY public.asteroid.asteroid_id;


--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(50) NOT NULL,
    age_in_billions_of_years numeric(5,1) NOT NULL,
    diameter_in_light_years integer,
    has_black_hole boolean DEFAULT false,
    is_spiral boolean,
    description text
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(50) NOT NULL,
    planet_id integer NOT NULL,
    diameter_km integer,
    distance_from_planet_km integer NOT NULL,
    is_spherical boolean,
    has_water boolean DEFAULT false,
    orbital_period_days numeric(10,2)
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(50) NOT NULL,
    star_id integer NOT NULL,
    diameter_km integer,
    distance_from_star_au numeric(10,2) NOT NULL,
    has_atmosphere boolean,
    is_habitable boolean DEFAULT false,
    planet_type character varying(50)
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(50) NOT NULL,
    galaxy_id integer NOT NULL,
    temperature_kelvin integer NOT NULL,
    mass_solar_units numeric(8,2),
    is_binary boolean DEFAULT false,
    has_planets boolean
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_star_id_seq OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_star_id_seq OWNED BY public.star.star_id;


--
-- Name: asteroid asteroid_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid ALTER COLUMN asteroid_id SET DEFAULT nextval('public.asteroid_asteroid_id_seq'::regclass);


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_galaxy_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_planet_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_star_id_seq'::regclass);


--
-- Data for Name: asteroid; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.asteroid VALUES (1, 'Ceres', 939, false, false, 1801, 'Carbonaceous');
INSERT INTO public.asteroid VALUES (2, 'Vesta', 525, false, false, 1807, 'Basaltic');
INSERT INTO public.asteroid VALUES (3, 'Pallas', 512, false, false, 1802, 'Carbonaceous');
INSERT INTO public.asteroid VALUES (4, 'Hygiea', 434, false, false, 1849, 'Carbonaceous');
INSERT INTO public.asteroid VALUES (5, 'Bennu', 0, true, true, 1999, 'Carbonaceous');


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 13.6, 100000, true, true, 'Our home galaxy');
INSERT INTO public.galaxy VALUES (2, 'Andromeda', 10.1, 220000, true, true, 'Nearest spiral galaxy to Milky Way');
INSERT INTO public.galaxy VALUES (3, 'Triangulum', 10.0, 60000, false, true, 'Third-largest galaxy in the Local Group');
INSERT INTO public.galaxy VALUES (4, 'Centaurus A', 13.2, 60000, true, false, 'Prominent radio galaxy');
INSERT INTO public.galaxy VALUES (5, 'Whirlpool Galaxy', 8.4, 60000, true, true, 'Interacting grand-design spiral galaxy');
INSERT INTO public.galaxy VALUES (6, 'Sombrero Galaxy', 13.3, 50000, true, false, 'Has a bright nucleus and large central bulge');


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 'Moon', 3, 3474, 384400, true, true, 27.32);
INSERT INTO public.moon VALUES (2, 'Phobos', 4, 22, 9377, false, false, 0.32);
INSERT INTO public.moon VALUES (3, 'Deimos', 4, 12, 23460, false, false, 1.26);
INSERT INTO public.moon VALUES (4, 'Io', 5, 3643, 421800, true, false, 1.77);
INSERT INTO public.moon VALUES (5, 'Europa', 5, 3122, 671100, true, true, 3.55);
INSERT INTO public.moon VALUES (6, 'Ganymede', 5, 5268, 1070400, true, true, 7.15);
INSERT INTO public.moon VALUES (7, 'Callisto', 5, 4821, 1882700, true, true, 16.69);
INSERT INTO public.moon VALUES (8, 'Amalthea', 5, 167, 181400, false, false, 0.50);
INSERT INTO public.moon VALUES (9, 'Titan', 6, 5149, 1221870, true, true, 15.95);
INSERT INTO public.moon VALUES (10, 'Enceladus', 6, 504, 238040, true, true, 1.37);
INSERT INTO public.moon VALUES (11, 'Mimas', 6, 396, 185540, true, false, 0.94);
INSERT INTO public.moon VALUES (12, 'Dione', 6, 1123, 377420, true, true, 2.74);
INSERT INTO public.moon VALUES (13, 'Tethys', 6, 1062, 294670, true, true, 1.89);
INSERT INTO public.moon VALUES (14, 'Rhea', 6, 1527, 527070, true, true, 4.52);
INSERT INTO public.moon VALUES (15, 'Iapetus', 6, 1470, 3560840, true, false, 79.32);
INSERT INTO public.moon VALUES (16, 'Miranda', 7, 472, 129900, true, false, 1.41);
INSERT INTO public.moon VALUES (17, 'Ariel', 7, 1158, 191020, true, true, 2.52);
INSERT INTO public.moon VALUES (18, 'Umbriel', 7, 1169, 266300, true, false, 4.14);
INSERT INTO public.moon VALUES (19, 'Titania', 7, 1577, 435910, true, true, 8.71);
INSERT INTO public.moon VALUES (20, 'Oberon', 7, 1523, 583520, true, true, 13.46);
INSERT INTO public.moon VALUES (21, 'Triton', 8, 2707, 354759, true, true, 5.88);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 'Mercury', 1, 4880, 0.39, false, false, 'Terrestrial');
INSERT INTO public.planet VALUES (2, 'Venus', 1, 12104, 0.72, true, false, 'Terrestrial');
INSERT INTO public.planet VALUES (3, 'Earth', 1, 12756, 1.00, true, true, 'Terrestrial');
INSERT INTO public.planet VALUES (4, 'Mars', 1, 6792, 1.52, true, false, 'Terrestrial');
INSERT INTO public.planet VALUES (5, 'Jupiter', 1, 142984, 5.20, true, false, 'Gas Giant');
INSERT INTO public.planet VALUES (6, 'Saturn', 1, 120536, 9.58, true, false, 'Gas Giant');
INSERT INTO public.planet VALUES (7, 'Uranus', 1, 51118, 19.22, true, false, 'Ice Giant');
INSERT INTO public.planet VALUES (8, 'Neptune', 1, 49528, 30.05, true, false, 'Ice Giant');
INSERT INTO public.planet VALUES (9, 'Proxima Centauri b', 2, 12000, 0.05, false, true, 'Terrestrial');
INSERT INTO public.planet VALUES (10, 'Vega b', 6, 15000, 0.80, true, false, 'Super-Earth');
INSERT INTO public.planet VALUES (11, 'Vega c', 6, 120000, 5.50, true, false, 'Gas Giant');
INSERT INTO public.planet VALUES (12, 'Vega d', 6, 40000, 12.00, false, false, 'Ice Giant');


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (1, 'Sun', 1, 5778, 1.00, false, true);
INSERT INTO public.star VALUES (2, 'Proxima Centauri', 1, 3042, 0.12, false, true);
INSERT INTO public.star VALUES (3, 'Alpha Centauri A', 1, 5790, 1.10, true, false);
INSERT INTO public.star VALUES (4, 'Sirius', 1, 9940, 2.02, true, false);
INSERT INTO public.star VALUES (5, 'Betelgeuse', 1, 3500, 11.60, false, false);
INSERT INTO public.star VALUES (6, 'Vega', 1, 9602, 2.14, false, true);
INSERT INTO public.star VALUES (7, 'Antares', 1, 3500, 12.00, false, false);


--
-- Name: asteroid_asteroid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.asteroid_asteroid_id_seq', 5, true);


--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_galaxy_id_seq', 6, true);


--
-- Name: moon_moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_moon_id_seq', 21, true);


--
-- Name: planet_planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_planet_id_seq', 12, true);


--
-- Name: star_star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_star_id_seq', 7, true);


--
-- Name: asteroid asteroid_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid
    ADD CONSTRAINT asteroid_name_key UNIQUE (name);


--
-- Name: asteroid asteroid_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.asteroid
    ADD CONSTRAINT asteroid_pkey PRIMARY KEY (asteroid_id);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--

