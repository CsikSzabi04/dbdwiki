import { describe, it, expect } from 'vitest';
import { calculatePerkStrength, killerBuilds, survivorBuilds, getMatchingBuilds } from './allslot';

describe('allslot logic', () => {
    describe('calculatePerkStrength', () => {
        it('should return 0 for an empty loadout', () => {
            expect(calculatePerkStrength([], 'killer')).toBe(0);
            expect(calculatePerkStrength([null, null, null, null], 'killer')).toBe(0);
        });

        it('should rate a completely random set of 4 perks low, but > 0', () => {
            const randomLoadout = [
                { id: 1000, name: "Random Perk 1" },
                { id: 1001, name: "Random Perk 2" },
                { id: 1002, name: "Random Perk 3" },
                { id: 1003, name: "Random Perk 4" }
            ];
            const score = calculatePerkStrength(randomLoadout, 'killer');
            expect(score).toBeGreaterThan(0);
            // Without meta synergy, a random build shouldn't score above 20-30%
            expect(score).toBeLessThan(40);
        });

        it('should return a high scaled score (around 85) for an exact meta killer build', () => {
            const metaBuild = killerBuilds[0].perks;
            const score = calculatePerkStrength(metaBuild, 'killer');
            expect(score).toBeGreaterThanOrEqual(80);
        });

        it('should return a high scaled score (around 85) for an exact meta survivor build', () => {
            const metaBuild = survivorBuilds[0].perks;
            const score = calculatePerkStrength(metaBuild, 'survivor');
            expect(score).toBeGreaterThanOrEqual(80);
        });

        it('should return a medium score for a partial 3-perk meta build', () => {
            const metaBuild = killerBuilds[0].perks.slice(0, 3);
            metaBuild.push(null); // Missing the 4th perk

            const score = calculatePerkStrength(metaBuild, 'killer');
            expect(score).toBeGreaterThan(39); // Since minimum for 3/4 build is 40 due to scaling
            expect(score).toBeLessThan(85);
        });
    });

    describe('getMatchingBuilds', () => {
        it('should return matching builds for a killer loadout', () => {
            const metaBuild = killerBuilds[0].perks;
            const matches = getMatchingBuilds(metaBuild, 'killer');

            expect(matches).toBeInstanceOf(Array);
            expect(matches.length).toBeGreaterThan(0);
            expect(matches[0].buildName).toBe(killerBuilds[0].name);
        });

        it('should return empty array for completely unknown perks', () => {
            const randomLoadout = [
                { id: 1000, name: "Random Perk 1" }
            ];
            const matches = getMatchingBuilds(randomLoadout, 'survivor');
            expect(matches).toEqual([]);
        });
    });
});
