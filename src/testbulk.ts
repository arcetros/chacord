// import Client from "./api/Client";

(async () => {
    // const client = new Client({api_key: "VeuANtE4kqGp7R8LHmPB4OO4St8SS6r0LVhCYrBy"})
    const participants = "dankferrik/2, arcetros".split(",");
    const participantsObject = participants.map(participant => {
        const [name, seed] = participant.split("/");
        return { name, seed };
    });
    console.log(participantsObject);
})();
