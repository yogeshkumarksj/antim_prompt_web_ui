import { Music } from "lucide-react";
import AiToolScreen, { ReportList } from "../components/AiToolScreen";
import { VIRAL_SONGS_URL } from "../constants";
import { serviceById } from "../config/business";
import { normalizeSongs, songsRequestBody } from "../utils/aiFeature";

const service = serviceById("songs");

const fields = [
  {
    name: "niche",
    label: "Niche",
    required: true,
    maxLength: 80,
    placeholder: "fitness",
  },
  {
    name: "region",
    label: "Region",
    maxLength: 40,
    placeholder: "Leave blank for Global",
  },
  {
    name: "language",
    label: "Language",
    maxLength: 40,
    placeholder: "Optional, for example Hindi",
  },
];

function SongResults({ result }) {
  const hasBody = result.summary || result.songs.length || result.howToUse.length;
  if (!hasBody) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
        The report came back empty. Try a different niche.
      </div>
    );
  }

  const context = [result.niche, result.region, result.language].filter(Boolean).join(" · ");

  return (
    <div className="space-y-6">
      {(result.summary || result.disclaimer) && (
        <div className="rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-3 flex items-center text-primaryPurple">
            <Music size={20} className="mr-2" />
            <h3 className="text-lg font-black text-gray-900">Audio ideas</h3>
          </div>
          {result.summary && (
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{result.summary}</p>
          )}
          {context && (
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">{context}</p>
          )}
          {result.disclaimer && (
            <p className="mt-4 text-sm leading-relaxed text-gray-500">{result.disclaimer}</p>
          )}
        </div>
      )}

      {result.songs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {result.songs.map((song) => (
            <article
              key={song.id}
              className="rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-black tracking-tight text-gray-900">{song.title}</h3>
              {song.artist && <p className="mt-1 text-sm font-bold text-secondaryBlue">{song.artist}</p>}
              {song.why && <p className="mt-3 text-sm leading-relaxed text-gray-600">{song.why}</p>}
              {song.reelIdea && (
                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-black text-gray-400">Reel idea · </span>
                  {song.reelIdea}
                </p>
              )}
              {song.hook && (
                <p className="mt-3 rounded-2xl bg-purple-50 p-3 text-sm font-medium text-gray-700">
                  {song.hook}
                </p>
              )}
              {song.hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {song.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600"
                    >
                      #{tag.replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <ReportList title="How to use these sounds" items={result.howToUse} />
    </div>
  );
}

export default function ViralSongs() {
  return (
    <AiToolScreen
      title={service.name}
      description="Enter a niche. Region and language are optional. This asks the server for free audio ideas and shows them on this page. It is not a live Instagram scan."
      submitLabel="FIND SONGS"
      loadingLabel="Finding audio ideas..."
      price={service.price}
      paid={service.paid}
      examples={["Fitness", "Wedding", "Devotional", "Cafes"]}
      fields={fields}
      endpoint={VIRAL_SONGS_URL}
      buildBody={songsRequestBody}
      normalize={normalizeSongs}
      renderResult={(result) => <SongResults result={result} />}
    />
  );
}
