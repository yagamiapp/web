import prisma from "$lib/prisma";

// Returns a Map object from a beatmap ID.
export const fetchBeatmap = async (beatmapId: string) => {
    let beatmap;

    // Lookup beatmap in DB
    beatmap = await prisma.map.findUnique({
        where: {
            beatmap_id: beatmapId
        }
    });
    
    if (!beatmap) {
        // Lookup beatmap in osu!web API
        // OMG the test DB data used v1 API lmao
        // const apiResponse = await fetch('https://osu.ppy.sh/api/v2/beatmaps/' + formData.id);
        // const beatmapData = await apiResponse.json();
        
        beatmap = await prisma.map.create({
            data: {
                beatmap_id: beatmapId
            }
        });
    }

    return beatmap;
}