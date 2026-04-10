#!/usr/bin/env python3
"""Tag all passages based on book/author metadata."""
import json

# Book → tags mapping (genre, mood, topic)
BOOK_TAGS = {
    # Austen
    "Pride and Prejudice": ["fiction", "romance", "classic", "social-commentary", "british"],
    "Sense and Sensibility": ["fiction", "romance", "classic", "social-commentary", "british"],
    "Emma": ["fiction", "romance", "classic", "social-commentary", "british"],
    "Persuasion": ["fiction", "romance", "classic", "social-commentary", "british"],
    # Dostoevsky
    "Crime and Punishment": ["fiction", "psychological", "philosophy", "russian", "dark"],
    "The Brothers Karamazov": ["fiction", "philosophy", "religion", "russian", "dark"],
    "Notes from Underground": ["fiction", "philosophy", "psychological", "russian", "existential"],
    # Wilde
    "The Picture of Dorian Gray": ["fiction", "gothic", "philosophy", "aestheticism", "british"],
    # Shelley
    "Frankenstein": ["fiction", "gothic", "science-fiction", "horror", "british"],
    # Woolf
    "Mrs Dalloway": ["fiction", "modernist", "psychological", "british", "stream-of-consciousness"],
    "To the Lighthouse": ["fiction", "modernist", "psychological", "british", "stream-of-consciousness"],
    "Orlando": ["fiction", "modernist", "fantasy", "gender", "british"],
    # Melville
    "Moby-Dick": ["fiction", "adventure", "philosophical", "american", "classic"],
    # Dickens
    "A Tale of Two Cities": ["fiction", "historical", "revolution", "british", "classic"],
    "Great Expectations": ["fiction", "coming-of-age", "social-commentary", "british", "classic"],
    "Oliver Twist": ["fiction", "social-commentary", "poverty", "british", "classic"],
    "David Copperfield": ["fiction", "coming-of-age", "autobiography", "british", "classic"],
    # Tolstoy
    "Anna Karenina": ["fiction", "romance", "tragedy", "russian", "classic"],
    "War and Peace": ["fiction", "historical", "war", "russian", "epic"],
    # Fitzgerald
    "The Great Gatsby": ["fiction", "american", "jazz-age", "tragedy", "classic"],
    # Philosophy
    "Meditations": ["philosophy", "stoicism", "self-improvement", "ancient", "wisdom"],
    "The Art of War": ["philosophy", "strategy", "military", "ancient", "chinese"],
    "The Prince": ["philosophy", "politics", "power", "italian", "classic"],
    "Candide": ["fiction", "satire", "philosophy", "french", "enlightenment"],
    "The Odyssey": ["fiction", "epic", "mythology", "ancient", "greek"],
    "The Iliad": ["fiction", "epic", "war", "mythology", "greek"],
    "Dialogues": ["philosophy", "ethics", "ancient", "greek", "wisdom"],
    "Beyond Good and Evil": ["philosophy", "existential", "german", "ethics", "provocative"],
    "Thus Spake Zarathustra": ["philosophy", "existential", "german", "poetry", "provocative"],
    "The Enchiridion": ["philosophy", "stoicism", "self-improvement", "ancient", "wisdom"],
    # Seneca
    "The Nicomachean Ethics": ["philosophy", "ethics", "ancient", "greek", "wisdom"],
    "The Varieties of Religious Experience": ["philosophy", "psychology", "religion", "american"],
    "The Social Contract": ["philosophy", "politics", "french", "enlightenment", "democracy"],
    "On Liberty": ["philosophy", "politics", "british", "freedom", "classic"],
    "Commentaries on the Gallic War": ["history", "military", "ancient", "roman", "memoir"],
    "The Communist Manifesto": ["philosophy", "politics", "economics", "revolutionary", "classic"],
    "Essays": ["philosophy", "transcendentalism", "american", "nature", "wisdom"],
    "Walden": ["philosophy", "nature", "transcendentalism", "american", "solitude"],
    # Brontës
    "Jane Eyre": ["fiction", "romance", "gothic", "british", "feminist"],
    "Wuthering Heights": ["fiction", "romance", "gothic", "dark", "british"],
    # Eliot
    "Middlemarch": ["fiction", "social-commentary", "british", "realism", "classic"],
    # Hardy
    "Tess of the d'Urbervilles": ["fiction", "tragedy", "british", "rural", "classic"],
    "Far from the Madding Crowd": ["fiction", "romance", "british", "rural", "classic"],
    # Flaubert
    "Madame Bovary": ["fiction", "realism", "french", "tragedy", "classic"],
    # Hugo
    "Les Misérables": ["fiction", "historical", "french", "social-justice", "epic"],
    # Dumas
    "The Count of Monte Cristo": ["fiction", "adventure", "revenge", "french", "classic"],
    # Twain
    "Adventures of Huckleberry Finn": ["fiction", "adventure", "american", "satire", "coming-of-age"],
    "The Adventures of Tom Sawyer": ["fiction", "adventure", "american", "humor", "coming-of-age"],
    # Conrad
    "Heart of Darkness": ["fiction", "colonialism", "psychological", "british", "dark"],
    "Lord Jim": ["fiction", "adventure", "psychological", "british", "classic"],
    # Joyce
    "Dubliners": ["fiction", "short-stories", "irish", "modernist", "realism"],
    "A Portrait of the Artist as a Young Man": ["fiction", "coming-of-age", "irish", "modernist", "autobiographical"],
    # Lawrence
    "Sons and Lovers": ["fiction", "psychological", "british", "family", "modernist"],
    # Forster
    "A Room with a View": ["fiction", "romance", "british", "social-commentary", "travel"],
    "Howards End": ["fiction", "social-commentary", "british", "class", "classic"],
    # James
    "The Turn of the Screw": ["fiction", "gothic", "horror", "psychological", "british"],
    "The Portrait of a Lady": ["fiction", "psychological", "american", "classic", "society"],
    # Hawthorne
    "The Scarlet Letter": ["fiction", "historical", "american", "puritan", "sin"],
    # London
    "The Call of the Wild": ["fiction", "adventure", "nature", "american", "survival"],
    "White Fang": ["fiction", "adventure", "nature", "american", "survival"],
    # Stevenson
    "Treasure Island": ["fiction", "adventure", "pirates", "british", "classic"],
    "Strange Case of Dr. Jekyll and Mr. Hyde": ["fiction", "gothic", "horror", "psychological", "british"],
    # Stoker
    "Dracula": ["fiction", "gothic", "horror", "vampire", "british"],
    # Kipling
    "The Jungle Book": ["fiction", "adventure", "nature", "animals", "british"],
    # Wells
    "The Time Machine": ["fiction", "science-fiction", "british", "dystopian", "classic"],
    "The War of the Worlds": ["fiction", "science-fiction", "invasion", "british", "classic"],
    "The Invisible Man": ["fiction", "science-fiction", "horror", "british", "classic"],
    # Verne
    "Around the World in Eighty Days": ["fiction", "adventure", "travel", "french", "classic"],
    # Short fiction collections
    "Short Fiction": [],  # Will be handled by author
    # Poe
    # Dante
    "The Divine Comedy": ["fiction", "epic", "poetry", "italian", "religious"],
    # Cervantes
    "Don Quixote": ["fiction", "satire", "adventure", "spanish", "classic"],
    # Swift
    "Gulliver's Travels": ["fiction", "satire", "adventure", "british", "classic"],
    # Wharton
    "The Age of Innocence": ["fiction", "social-commentary", "american", "gilded-age", "classic"],
    "The House of Mirth": ["fiction", "tragedy", "american", "society", "classic"],
    # Cather
    "My Ántonia": ["fiction", "american", "frontier", "immigration", "classic"],
    # Chopin
    "The Awakening": ["fiction", "feminist", "american", "psychological", "classic"],
    # Ford
    "The Good Soldier": ["fiction", "modernist", "psychological", "british", "unreliable-narrator"],
    # Maugham
    "Of Human Bondage": ["fiction", "coming-of-age", "british", "autobiographical", "classic"],
    # Lewis
    "Main Street": ["fiction", "satire", "american", "small-town", "realism"],
    # Dreiser
    "Sister Carrie": ["fiction", "naturalism", "american", "urban", "classic"],
    # Sinclair
    "The Jungle": ["fiction", "social-commentary", "american", "labor", "muckraking"],
    # Collins
    "The Woman in White": ["fiction", "mystery", "gothic", "british", "classic"],
    "The Moonstone": ["fiction", "mystery", "detective", "british", "classic"],
    # Doyle
    "The Hound of the Baskervilles": ["fiction", "mystery", "detective", "british", "classic"],
    # Leroux
    "The Phantom of the Opera": ["fiction", "gothic", "romance", "french", "classic"],
    # Turgenev
    "Fathers and Children": ["fiction", "russian", "generational", "nihilism", "classic"],
    # Gogol
    "Dead Souls": ["fiction", "satire", "russian", "dark-humor", "classic"],
}

# Author-based tags for "Short Fiction" etc.
AUTHOR_TAGS = {
    "Edgar Allan Poe": ["fiction", "gothic", "horror", "mystery", "american"],
    "O. Henry": ["fiction", "short-stories", "american", "twist-ending", "humor"],
    "Anton Chekhov": ["fiction", "short-stories", "russian", "realism", "melancholy"],
    "H. P. Lovecraft": ["fiction", "horror", "cosmic-horror", "american", "dark"],
    "Ralph Waldo Emerson": ["philosophy", "transcendentalism", "american", "nature", "wisdom"],
    "Seneca": ["philosophy", "stoicism", "ancient", "roman", "wisdom"],
}

def tag_passage(p):
    title = p.get("bookTitle", "")
    author = p.get("author", "")
    
    tags = BOOK_TAGS.get(title, [])
    if not tags:
        tags = AUTHOR_TAGS.get(author, ["fiction", "classic"])
    
    p["tags"] = tags
    return p

with open("src/data/passages.json") as f:
    data = json.load(f)

for p in data:
    tag_passage(p)

# Verify
empty = [p for p in data if not p["tags"]]
print(f"Tagged: {len(data) - len(empty)}/{len(data)}")
if empty:
    print(f"Still empty: {[(p['bookTitle'], p['author']) for p in empty[:5]]}")

with open("src/data/passages.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Done! passages.json updated.")
