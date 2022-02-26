using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using AngleSharp;
using AngleSharp.Css;
using AngleSharp.Css.Dom;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

namespace bombdata
{
	internal static class Program
	{
		private static void Main()
		{
			var packs = new List<MissionPack>();
			foreach (string path in Directory.GetDirectories("bombhtml/"))
			{
				var listSheet = ParseSheet(Path.Combine(path, "Bomb List.html"));

				foreach (var missionRow in listSheet.Skip(4))
				{
					if (string.IsNullOrEmpty(missionRow[0].Content))
					{
						break;
					}

					var href = missionRow[1].Href;

					var pack = packs.Find(pack => pack.name == missionRow[1].Content);
					if (pack == null)
					{
						pack = new MissionPack()
						{
							name = missionRow[1].Content,
							author = missionRow[2].Content,
							steamID = href[(href.IndexOf("=") + 1)..],
							missions = new List<Mission>(),
						};
						packs.Add(pack);
					}

					var fileName = missionRow[0].Content.Replace('/', ' ').Replace('\\', ' ').Replace("Favourite", "Favorite");
					var filePath = Path.Combine(path, $"{fileName}.html");
					if (!File.Exists(filePath))
					{
						Console.WriteLine("Could not find mission: {0} ({1})", fileName, path);
						continue;
					}

					var fileContent = File.ReadAllText(filePath);
					var sheet = ParseSheet(filePath);

					var mission = new Mission()
					{
						name = missionRow[0].Content,
						bombs = sheet.Skip(1).Where(row => !string.IsNullOrEmpty(row[2].Content)).Select(row =>
						{
							return new Bomb()
							{
								modules = int.Parse(row[1].Content),
								time = ParseTime(row[2].Content),
								strikes = int.Parse(row[3].Content),
								widgets = int.Parse(row[4].Content),
								pools = new List<Pool>(),
							};
						}).ToArray(),
						completions = sheet.Skip(2).Where(row => !string.IsNullOrEmpty(row[5].Content)).Select(row =>
						{
							return new Completion()
							{
								proof = row[5].Href,
								time = ParseTime(row[6].Content),
								team = Enumerable.Range(7, 4).Select(index => row[index].Content).Where(cell => !string.IsNullOrEmpty(cell)).ToList(),
								first = row[6].Style.GetBackgroundColor() == "rgba(255, 255, 0, 1)",
								old = row[6].Style.GetFontStyle() == "italic"
							};
						}).ToList(),
						tpsolve = missionRow[7].Content == "Solved"
					};

					var bombIndex = 0;
					for (int i = 2; i < sheet.Count; i++)
					{
						var content = sheet[i][11].Content;
						if (string.IsNullOrEmpty(content))
						{
							bombIndex++;
							i++;
						}
						else
						{
							var match = new Regex(@"\[?(.+)\] (?:\((.+)\) )?Count: (\d+)").Match(content);
							var modules = match.Groups[1].Value.Split(", ");

							// If the sources are listed, update the "module" to include the source.
							var sources = match.Groups[2].Value.Split(" + ", StringSplitOptions.RemoveEmptyEntries);
							if (sources.Length == 1)
							{
								var source = sources[0] == "Mod" ? "MODS" : "VANILLA";
								modules[0] = $"ALL_{source}_{modules[0][4..]}";
							}

							mission.bombs[bombIndex].pools.Add(new Pool()
							{
								count = int.Parse(match.Groups[3].Value),
								modules = modules
							});

							i += sheet[i][11].RowSpan - 1;
						}
					}

					pack.missions.Add(mission);
				}
			}

			File.WriteAllText("bombs.json", JsonSerializer.Serialize(packs));
		}

		private static int ParseTime(string time)
		{
			var parts = time.Split(":");
			return (int.Parse(parts[0]) * 60) + int.Parse(parts[1]);
		}

		private static List<List<Cell>> ParseSheet(string path)
		{
			var fileContent = File.ReadAllText(path);
			var document = new HtmlParser(new HtmlParserOptions(), BrowsingContext.New(Configuration.Default.WithCss())).ParseDocument(fileContent);

			var rows = document.QuerySelectorAll("tr").Skip(1);
			var columns = rows.Max(row => row.ChildElementCount);

			var sheet = new List<List<Cell>>();

			for (int i = 0; i < rows.Count(); i++)
			{
				sheet.Add(Enumerable.Repeat<Cell>(null, columns).ToList());
			}

			var x = 0;
			var y = 0;
			foreach (var row in rows)
			{
				foreach (var cell in row.Children.Skip(1))
				{
					int colspan = int.Parse(cell.GetAttribute("colspan") ?? "1");
					int rowspan = int.Parse(cell.GetAttribute("rowspan") ?? "1");

					var content = cell.TextContent;
					var link = cell.QuerySelector<IHtmlAnchorElement>("a");

					for (int xOffset = 0; xOffset < colspan; xOffset++)
					{
						for (int yOffset = 0; yOffset < rowspan; yOffset++)
						{
							sheet[y + yOffset][x + xOffset] = new Cell()
							{
								Content = content,
								Element = cell,
								ColSpan = colspan,
								RowSpan = rowspan
							};

							if (link != null)
							{
								sheet[y + yOffset][x + xOffset].Href = link.Href;
							}
						}
					}

					x += colspan;
					while (sheet[y][x] != null)
					{
						x++;
					}
				}

				x = 0;
				y++;

				while (y < rows.Count() && sheet[y][x] != null)
				{
					x++;
				}
			}

			return sheet;
		}
	}

	internal class Cell
	{
		public string Content;
		public string Href;
		public IElement Element;
		public int RowSpan;
		public int ColSpan;

		private ICssStyleDeclaration style;
		public ICssStyleDeclaration Style => style ??= Element.ComputeCurrentStyle();
	}

	internal class MissionPack
	{
		public string name { get; set; }
		public string author { get; set; }
		public string steamID { get; set; }
		public List<Mission> missions { get; set; }
	}

	internal class Mission
	{
		public string name { get; set; }
		public Bomb[] bombs { get; set; }
		public List<Completion> completions { get; set; }
		public bool tpsolve { get; set; }
	}

	internal class Bomb
	{
		public int modules { get; set; }
		public int time { get; set; }
		public int strikes { get; set; }
		public int widgets { get; set; }
		public List<Pool> pools { get; set; }
	}

	internal class Pool
	{
		public string[] modules { get; set; }
		public int count { get; set; }
	}

	internal class Completion
	{
		public string proof { get; set; }
		public int time { get; set; }
		public List<string> team { get; set; }
		public bool first { get; set; }
		public bool old { get; set; }
	}
}
