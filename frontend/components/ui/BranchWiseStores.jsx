"use client"
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.isEnd = true;
    }

    search(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return this.collectWords(node, prefix);
    }

    collectWords(node, prefix) {
        let results = [];
        if (node.isEnd) results.push(prefix);
        for (let char in node.children) {
            results.push(...this.collectWords(node.children[char], prefix + char));
        }
        return results;
    }
}

const BranchWiseStores = ({ branchList }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const trieRef = useRef(new Trie());
    
    useEffect(() => {
      trieRef.current = new Trie(); // Reset Trie
      branchList.forEach(branch => trieRef.current.insert(branch.branch.toLowerCase()));
    }, [branchList]); // Rebuild Trie when branchList changes
    
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        const matches = trieRef.current.search(query);
        if (matches.length > 0) {
            const foundIndex = branchList.findIndex(branch => branch.branch.toLowerCase() === matches[0]);
            if (foundIndex !== -1) {
                setCurrentIndex(foundIndex);
            }
        }
    };

    return (
        <div className="p-5 shadow-lg shadow-green-500 rounded-lg flex flex-col gap-3 relative">
            <input 
                type="text" 
                placeholder="Search branch..." 
                className="p-2 border rounded-md focus:outline-none text-black"
                value={searchQuery} 
                onChange={handleSearch} 
            />
            <div className="flex justify-between items-center">
                <p className="text-3xl tracking-wide font-semibold">
                    {(branchList[currentIndex]?.branch).toUpperCase()}
                </p>
                <p className="text-2xl font-semibold">
                    {branchList[currentIndex]?.store_count}
                </p>
            </div>
            <div 
                className='absolute rounded-full w-5 h-5 bg-green-500 shadow-md shadow-green-400/60 -left-3 top-1/2 cursor-pointer flex justify-center items-center' 
                onClick={() => setCurrentIndex(currentIndex === 0 ? branchList.length - 1 : currentIndex - 1)}
            >
                <ChevronLeft />
            </div>
            <div 
                className='absolute rounded-full w-5 h-5 bg-green-500 shadow-md shadow-green-400/60 -right-3 top-1/2 cursor-pointer flex justify-center items-center' 
                onClick={() => setCurrentIndex(currentIndex === branchList.length - 1 ? 0 : currentIndex + 1)}
            >
                <ChevronRight />
            </div>
        </div>
    );
};

export default BranchWiseStores;
