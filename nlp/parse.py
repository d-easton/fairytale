"""
NLP support script
    This file applies the NCR lexicon of emotional sentiment terms to the English and German
    fairytale corpora, inorder to prepare a clean dataset needed for the D3 visualizations.

    This is done in setup so the text processing side isn't done in the client browser; that process
    could easily slow down the visualization render time and make the page less responsive.
"""

import json
import re

# locations of all the files in each corpus
english_corpus_urls = [
    '../data/englishfairytales/tomtittot.txt',
    '../data/englishfairytales/themasterandhispupil.txt',
    '../data/englishfairytales/therosetree.txt',
    '../data/englishfairytales/thehistoryoftomthumb.txt',
    '../data/englishfairytales/thefishandthering.txt',
    '../data/englishfairytales/mrfox.txt',
    '../data/englishfairytales/howjackwenttoseekhisfortune.txt',
    '../data/englishfairytales/mollywhuppie.txt',
    '../data/englishfairytales/thewelloftheworldsend.txt',
    '../data/englishfairytales/thethreeheadsofthewell.txt',
]

german_corpus_urls = [
    '../data/germanfairytales/diefroschkoenig.txt',
    '../data/germanfairytales/derzauberlehrling.txt',
    '../data/germanfairytales/daumsdick.txt',
    '../data/germanfairytales/frauholle.txt',
    '../data/germanfairytales/hanselundgretel.txt',
    '../data/germanfairytales/rumpelstilzchen.txt',
    '../data/germanfairytales/diebremerstadtmusikanten.txt',
    '../data/germanfairytales/derteufelmitdendreigoldenenhaaren.txt',
    '../data/germanfairytales/vondemmachandelboom.txt',
    '../data/germanfairytales/derrauberbrautigem.txt',
]



# open a text and return a list of its tokens, cleaned up
def import_text(text_url):
    token_list = []
    with open(text_url) as t:
        for l in t.readlines(): 
            for t in l.split():
                token_list.append( re.sub(r'[^a-zA-Z0-9\s]', '', t.strip()).lower() )
    
    return token_list

# generate corpus
def generate_corpus(corpus_urls):
    corpus_tokens = []
    for url in corpus_urls:
        corpus_tokens.append( import_text(url) )
    return corpus_tokens


# write data to .json file
def write_output(data, lang):
    output_dest = lang+'_emotion_data.json'
    with open(output_dest, 'w') as output_file:
        json.dump(data, output_file)
    return 0


def primary():
    # print(generate_corpus(english_corpus_urls))
    # print(english_corpus_urls)
    print(generate_corpus(german_corpus_urls))

if __name__ == "__main__":
    print("launch")
    primary()
    print("DONE")
