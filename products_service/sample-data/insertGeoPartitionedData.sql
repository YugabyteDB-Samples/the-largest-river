TRUNCATE TABLE products;

INSERT INTO
    products(
        author,
        "imageLink",
        title,
        price,
        product_type,
        geo_partition
    )
VALUES
    (
        'Chinua Achebe',
        'images/things-fall-apart.jpg',
        'Things Fall Apart',
        19.99,
        'book',
        'USA'
    ),
    (
        'Hans Christian Andersen',
        'images/fairy-tales.jpg',
        'Fairy tales',
        15.97,
        'book',
        'USA'
    ),
    (
        'Dante Alighieri',
        'images/the-divine-comedy.jpg',
        'The Divine Comedy',
        19.99,
        'book',
        'USA'
    ),
    (
        'Unknown',
        'images/the-epic-of-gilgamesh.jpg',
        'The Epic Of Gilgamesh',
        9.98,
        'book',
        'USA'
    ),
    (
        'Unknown',
        'images/the-book-of-job.jpg',
        'The Book Of Job',
        21.97,
        'book',
        'USA'
    ),
    (
        'Unknown',
        'images/one-thousand-and-one-nights.jpg',
        'One Thousand and One Nights',
        16.99,
        'book',
        'USA'
    ),
    (
        'Unknown',
        'images/njals-saga.jpg',
        'Njál''s Saga',
        8.98,
        'book',
        'USA'
    ),
    (
        'Jane Austen',
        'images/pride-and-prejudice.jpg',
        'Pride and Prejudice',
        21.98,
        'book',
        'USA'
    ),
    (
        'Honoré de Balzac',
        'images/le-pere-goriot.jpg',
        'Le Père Goriot',
        10.99,
        'book',
        'USA'
    ),
    (
        'Samuel Beckett',
        'images/molloy-malone-dies-the-unnamable.jpg',
        'Molloy, Malone Dies, The Unnamable, the trilogy',
        6.99,
        'book',
        'USA'
    ),
    (
        'Giovanni Boccaccio',
        'images/the-decameron.jpg',
        'The Decameron',
        8.98,
        'book',
        'USA'
    ),
    (
        'Jorge Luis Borges',
        'images/ficciones.jpg',
        'Ficciones',
        7.98,
        'book',
        'USA'
    ),
    (
        'Emily Brontë',
        'images/wuthering-heights.jpg',
        'Wuthering Heights',
        16.99,
        'book',
        'USA'
    ),
    (
        'Albert Camus',
        'images/l-etranger.jpg',
        'The Stranger',
        7.97,
        'book',
        'USA'
    ),
    (
        'Paul Celan',
        'images/poems-paul-celan.jpg',
        'Poems',
        9.98,
        'book',
        'USA'
    ),
    (
        'Louis-Ferdinand Céline',
        'images/voyage-au-bout-de-la-nuit.jpg',
        'Journey to the End of the Night',
        21.99,
        'book',
        'USA'
    ),
    (
        'Miguel de Cervantes',
        'images/don-quijote-de-la-mancha.jpg',
        'Don Quijote De La Mancha',
        5.98,
        'book',
        'USA'
    ),
    (
        'Geoffrey Chaucer',
        'images/the-canterbury-tales.jpg',
        'The Canterbury Tales',
        5.98,
        'book',
        'USA'
    ),
    (
        'Anton Chekhov',
        'images/stories-of-anton-chekhov.jpg',
        'Stories',
        18.99,
        'book',
        'USA'
    ),
    (
        'Joseph Conrad',
        'images/nostromo.jpg',
        'Nostromo',
        18.97,
        'book',
        'USA'
    ),
    (
        'Charles Dickens',
        'images/great-expectations.jpg',
        'Great Expectations',
        14.98,
        'book',
        'BRA'
    ),
    (
        'Denis Diderot',
        'images/jacques-the-fatalist.jpg',
        'Jacques the Fatalist',
        7.98,
        'book',
        'BRA'
    ),
    (
        'Alfred Döblin',
        'images/berlin-alexanderplatz.jpg',
        'Berlin Alexanderplatz',
        19.98,
        'book',
        'BRA'
    ),
    (
        'Fyodor Dostoevsky',
        'images/crime-and-punishment.jpg',
        'Crime and Punishment',
        10.97,
        'book',
        'BRA'
    ),
    (
        'Fyodor Dostoevsky',
        'images/the-idiot.jpg',
        'The Idiot',
        19.97,
        'book',
        'BRA'
    ),
    (
        'Fyodor Dostoevsky',
        'images/the-possessed.jpg',
        'The Possessed',
        21.98,
        'book',
        'BRA'
    ),
    (
        'Fyodor Dostoevsky',
        'images/the-brothers-karamazov.jpg',
        'The Brothers Karamazov',
        21.97,
        'book',
        'BRA'
    ),
    (
        'George Eliot',
        'images/middlemarch.jpg',
        'Middlemarch',
        11.99,
        'book',
        'BRA'
    ),
    (
        'Ralph Ellison',
        'images/invisible-man.jpg',
        'Invisible Man',
        7.97,
        'book',
        'BRA'
    ),
    (
        'Euripides',
        'images/medea.jpg',
        'Medea',
        16.98,
        'book',
        'BRA'
    ),
    (
        'William Faulkner',
        'images/absalom-absalom.jpg',
        'Absalom, Absalom!',
        6.97,
        'book',
        'BRA'
    ),
    (
        'William Faulkner',
        'images/the-sound-and-the-fury.jpg',
        'The Sound and the Fury',
        7.97,
        'book',
        'BRA'
    ),
    (
        'Gustave Flaubert',
        'images/madame-bovary.jpg',
        'Madame Bovary',
        17.98,
        'book',
        'BRA'
    ),
    (
        'Gustave Flaubert',
        'images/l-education-sentimentale.jpg',
        'Sentimental Education',
        21.97,
        'book',
        'BRA'
    ),
    (
        'Federico García Lorca',
        'images/gypsy-ballads.jpg',
        'Gypsy Ballads',
        15.98,
        'book',
        'BRA'
    ),
    (
        'Gabriel García Márquez',
        'images/one-hundred-years-of-solitude.jpg',
        'One Hundred Years of Solitude',
        19.99,
        'book',
        'BRA'
    ),
    (
        'Gabriel García Márquez',
        'images/love-in-the-time-of-cholera.jpg',
        'Love in the Time of Cholera',
        22.97,
        'book',
        'BRA'
    ),
    (
        'Johann Wolfgang von Goethe',
        'images/faust.jpg',
        'Faust',
        6.99,
        'book',
        'BRA'
    ),
    (
        'Nikolai Gogol',
        'images/dead-souls.jpg',
        'Dead Souls',
        12.99,
        'book',
        'BRA'
    ),
    (
        'Günter Grass',
        'images/the-tin-drum.jpg',
        'The Tin Drum',
        18.97,
        'book',
        'BRA'
    ),
    (
        'João Guimarães Rosa',
        'images/the-devil-to-pay-in-the-backlands.jpg',
        'The Devil to Pay in the Backlands',
        19.99,
        'book',
        'LON'
    ),
    (
        'Knut Hamsun',
        'images/hunger.jpg',
        'Hunger',
        20.98,
        'book',
        'LON'
    ),
    (
        'Ernest Hemingway',
        'images/the-old-man-and-the-sea.jpg',
        'The Old Man and the Sea',
        19.98,
        'book',
        'LON'
    ),
    (
        'Homer',
        'images/the-iliad-of-homer.jpg',
        'Iliad',
        16.97,
        'book',
        'LON'
    ),
    (
        'Homer',
        'images/the-odyssey-of-homer.jpg',
        'Odyssey',
        18.98,
        'book',
        'LON'
    ),
    (
        'Henrik Ibsen',
        'images/a-Dolls-house.jpg',
        'A Doll''s House',
        8.97,
        'book',
        'LON'
    ),
    (
        'James Joyce',
        'images/ulysses.jpg',
        'Ulysses',
        19.99,
        'book',
        'LON'
    ),
    (
        'Franz Kafka',
        'images/stories-of-franz-kafka.jpg',
        'Stories',
        16.99,
        'book',
        'LON'
    ),
    (
        'Franz Kafka',
        'images/the-trial.jpg',
        'The Trial',
        6.97,
        'book',
        'LON'
    ),
    (
        'Franz Kafka',
        'images/the-castle.jpg',
        'The Castle',
        9.99,
        'book',
        'LON'
    ),
    (
        'Kālidāsa',
        'images/the-recognition-of-shakuntala.jpg',
        'The recognition of Shakuntala',
        18.97,
        'book',
        'LON'
    ),
    (
        'Yasunari Kawabata',
        'images/the-sound-of-the-mountain.jpg',
        'The Sound of the Mountain',
        13.99,
        'book',
        'LON'
    ),
    (
        'Nikos Kazantzakis',
        'images/zorba-the-greek.jpg',
        'Zorba the Greek',
        17.97,
        'book',
        'LON'
    ),
    (
        'D. H. Lawrence',
        'images/sons-and-lovers.jpg',
        'Sons and Lovers',
        7.98,
        'book',
        'LON'
    ),
    (
        'Halldór Laxness',
        'images/independent-people.jpg',
        'Independent People',
        19.97,
        'book',
        'LON'
    ),
    (
        'Giacomo Leopardi',
        'images/poems-giacomo-leopardi.jpg',
        'Poems',
        11.97,
        'book',
        'LON'
    ),
    (
        'Doris Lessing',
        'images/the-golden-notebook.jpg',
        'The Golden Notebook',
        19.99,
        'book',
        'LON'
    ),
    (
        'Astrid Lindgren',
        'images/pippi-longstocking.jpg',
        'Pippi Longstocking',
        15.97,
        'book',
        'LON'
    ),
    (
        'Lu Xun',
        'images/diary-of-a-madman.jpg',
        'Diary of a Madman',
        21.99,
        'book',
        'LON'
    ),
    (
        'Naguib Mahfouz',
        'images/children-of-gebelawi.jpg',
        'Children of Gebelawi',
        19.97,
        'book',
        'LON'
    ),
    (
        'Thomas Mann',
        'images/buddenbrooks.jpg',
        'Buddenbrooks',
        17.98,
        'book',
        'MUM'
    ),
    (
        'Thomas Mann',
        'images/the-magic-mountain.jpg',
        'The Magic Mountain',
        22.97,
        'book',
        'MUM'
    ),
    (
        'Herman Melville',
        'images/moby-dick.jpg',
        'Moby Dick',
        5.99,
        'book',
        'MUM'
    ),
    (
        'Michel de Montaigne',
        'images/essais.jpg',
        'Essays',
        19.97,
        'book',
        'MUM'
    ),
    (
        'Elsa Morante',
        'images/history.jpg',
        'History',
        20.97,
        'book',
        'MUM'
    ),
    (
        'Toni Morrison',
        'images/beloved.jpg',
        'Beloved',
        9.99,
        'book',
        'MUM'
    ),
    (
        'Murasaki Shikibu',
        'images/the-tale-of-genji.jpg',
        'The Tale of Genji',
        19.98,
        'book',
        'MUM'
    ),
    (
        'Robert Musil',
        'images/the-man-without-qualities.jpg',
        'The Man Without Qualities',
        17.98,
        'book',
        'MUM'
    ),
    (
        'Vladimir Nabokov',
        'images/lolita.jpg',
        'Lolita',
        11.97,
        'book',
        'MUM'
    ),
    (
        'George Orwell',
        'images/nineteen-eighty-four.jpg',
        'Nineteen Eighty-Four',
        19.97,
        'book',
        'MUM'
    ),
    (
        'Ovid',
        'images/the-metamorphoses-of-ovid.jpg',
        'Metamorphoses',
        11.98,
        'book',
        'MUM'
    ),
    (
        'Fernando Pessoa',
        'images/the-book-of-disquiet.jpg',
        'The Book of Disquiet',
        11.98,
        'book',
        'MUM'
    ),
    (
        'Edgar Allan Poe',
        'images/tales-and-poems-of-edgar-allan-poe.jpg',
        'Tales',
        7.98,
        'book',
        'MUM'
    ),
    (
        'Marcel Proust',
        'images/a-la-recherche-du-temps-perdu.jpg',
        'In Search of Lost Time',
        7.99,
        'book',
        'MUM'
    ),
    (
        'François Rabelais',
        'images/gargantua-and-pantagruel.jpg',
        'Gargantua and Pantagruel',
        19.97,
        'book',
        'MUM'
    ),
    (
        'Juan Rulfo',
        'images/pedro-paramo.jpg',
        'Pedro Páramo',
        9.98,
        'book',
        'MUM'
    ),
    (
        'Rumi',
        'images/the-masnavi.jpg',
        'The Masnavi',
        16.98,
        'book',
        'MUM'
    ),
    (
        'Salman Rushdie',
        'images/midnights-children.jpg',
        'Midnight''s Children',
        16.99,
        'book',
        'MUM'
    ),
    (
        'Saadi',
        'images/bostan.jpg',
        'Bostan',
        5.97,
        'book',
        'MUM'
    ),
    (
        'Tayeb Salih',
        'images/season-of-migration-to-the-north.jpg',
        'Season of Migration to the North',
        10.99,
        'book',
        'MUM'
    ),
    (
        'José Saramago',
        'images/blindness.jpg',
        'Blindness',
        16.98,
        'book',
        'SYD'
    ),
    (
        'William Shakespeare',
        'images/hamlet.jpg',
        'Hamlet',
        20.99,
        'book',
        'SYD'
    ),
    (
        'William Shakespeare',
        'images/king-lear.jpg',
        'King Lear',
        9.98,
        'book',
        'SYD'
    ),
    (
        'William Shakespeare',
        'images/othello.jpg',
        'Othello',
        21.98,
        'book',
        'SYD'
    ),
    (
        'Sophocles',
        'images/oedipus-the-king.jpg',
        'Oedipus the King',
        17.98,
        'book',
        'SYD'
    ),
    (
        'Stendhal',
        'images/le-rouge-et-le-noir.jpg',
        'The Red and the Black',
        19.99,
        'book',
        'SYD'
    ),
    (
        'Laurence Sterne',
        'images/the-life-and-opinions-of-tristram-shandy.jpg',
        'The Life And Opinions of Tristram Shandy',
        22.97,
        'book',
        'SYD'
    ),
    (
        'Italo Svevo',
        'images/confessions-of-zeno.jpg',
        'Confessions of Zeno',
        5.98,
        'book',
        'SYD'
    ),
    (
        'Jonathan Swift',
        'images/gullivers-travels.jpg',
        'Gulliver''s Travels',
        16.99,
        'book',
        'SYD'
    ),
    (
        'Leo Tolstoy',
        'images/war-and-peace.jpg',
        'War and Peace',
        6.98,
        'book',
        'SYD'
    ),
    (
        'Leo Tolstoy',
        'images/anna-karenina.jpg',
        'Anna Karenina',
        15.99,
        'book',
        'SYD'
    ),
    (
        'Leo Tolstoy',
        'images/the-death-of-ivan-ilyich.jpg',
        'The Death of Ivan Ilyich',
        8.98,
        'book',
        'SYD'
    ),
    (
        'Mark Twain',
        'images/the-adventures-of-huckleberry-finn.jpg',
        'The Adventures of Huckleberry Finn',
        15.99,
        'book',
        'SYD'
    ),
    (
        'Valmiki',
        'images/ramayana.jpg',
        'Ramayana',
        14.98,
        'book',
        'SYD'
    ),
    (
        'Virgil',
        'images/the-aeneid.jpg',
        'The Aeneid',
        21.97,
        'book',
        'SYD'
    ),
    (
        'Vyasa',
        'images/the-mahab-harata.jpg',
        'Mahabharata',
        13.97,
        'book',
        'SYD'
    ),
    (
        'Walt Whitman',
        'images/leaves-of-grass.jpg',
        'Leaves of Grass',
        12.98,
        'book',
        'SYD'
    ),
    (
        'Virginia Woolf',
        'images/mrs-dalloway.jpg',
        'Mrs Dalloway',
        15.97,
        'book',
        'SYD'
    ),
    (
        'Virginia Woolf',
        'images/to-the-lighthouse.jpg',
        'To the Lighthouse',
        21.98,
        'book',
        'SYD'
    ),
    (
        'Marguerite Yourcenar',
        'images/memoirs-of-hadrian.jpg',
        'Memoirs of Hadrian',
        12.98,
        'book',
        'SYD'
    );