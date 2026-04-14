import { ImagePlus, Trash2 } from "lucide-react";

function BannerUpload({
  bannerPreview,
  fileInputRef,
  onDrop,
  onChange,
  onRemove,
}) {
  if (!bannerPreview) {
    return (
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        <ImagePlus className="w-8 h-8 text-gray-300" />
        <p className="text-sm text-gray-400">
          Haz clic o arrastra una imagen aquí
        </p>
        <p className="text-xs text-gray-300">PNG, JPG, WEBP — máx. 5 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      <img
        src={bannerPreview}
        alt="Banner preview"
        className="w-full h-44 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          Cambiar
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Quitar
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

export default BannerUpload;
