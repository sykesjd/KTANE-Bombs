using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

namespace bombdata
{
	internal static class Program
	{
		private static void Main()
		{
			var bombs = new List<ChallengeBomb>();
			foreach (string path in Directory.GetFiles(@"/bombhtml"))
			{
				var fileContent = File.ReadAllText(path);
				var document = new HtmlParser().ParseDocument(fileContent);

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
						if (link != null)
						{
							content = link.Href;
						}

						for (int xOffset = 0; xOffset < colspan; xOffset++)
						{
							for (int yOffset = 0; yOffset < rowspan; yOffset++)
							{
								sheet[y + yOffset][x + xOffset] = new Cell()
								{
									Content = content,
									Classes = cell.ClassList,
									ColSpan = colspan,
									RowSpan = rowspan
								};
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

				var sheetName = sheet[0][0].Content;
				if (sheetName == "KTaNE - Challenge Bombs Spreadsheets - Made by Espik" || sheetName == "Completer")
					continue;

				var firstSolveClass = new Regex(@"\.(s\d+){background-color:#ffff00;").Match(fileContent).Groups[1].Value;

				var bomb = new ChallengeBomb()
				{
					Name = sheetName,
					Bombs = sheet.Skip(1).Where(row => !string.IsNullOrEmpty(row[2].Content)).Select(row =>
					{
						return new Bomb()
						{
							Modules = int.Parse(row[1].Content),
							Time = ParseTime(row[2].Content),
							Strikes = int.Parse(row[3].Content),
							Widgets = int.Parse(row[4].Content),
							Pools = new List<Pool>(),
						};
					}).ToArray(),
					Completions = sheet.Skip(2).Where(row => !string.IsNullOrEmpty(row[5].Content)).Select(row =>
					{
						return new Completion()
						{
							Proof = row[5].Content,
							Time = ParseTime(row[6].Content),
							Team = Enumerable.Range(7, 4).Select(index => row[index].Content).Where(cell => !string.IsNullOrEmpty(cell)).ToList(),
						};
					}).ToList(),
					FirstCompletion = sheet.Skip(2).Where(row => !string.IsNullOrEmpty(row[5].Content)).ToList().FindIndex(row => row[6].Classes.Contains(firstSolveClass))
				};

				var bombIndex = 0;
				for (int i = 2; i < rows.Count(); i++)
				{
					var content = sheet[i][11].Content;
					if (string.IsNullOrEmpty(content))
					{
						bombIndex++;
						i++;
					}
					else
					{
						var match = new Regex(@"\[?(.+)\] (?:\(.+\) )?Count: (\d+)").Match(content);
						bomb.Bombs[bombIndex].Pools.Add(new Pool()
						{
							Count = int.Parse(match.Groups[2].Value),
							Modules = match.Groups[1].Value.Split(", ")
						});

						i += sheet[i][11].RowSpan - 1;
					}
				}

				bombs.Add(bomb);
			}

			File.WriteAllText(@"bombs.json", JsonSerializer.Serialize(bombs));
		}

		private static int ParseTime(string time)
		{
			var parts = time.Split(":");
			return (int.Parse(parts[0]) * 60) + int.Parse(parts[1]);
		}
	}

	internal class Cell
	{
		public string Content;
		public ITokenList Classes;
		public int RowSpan;
		public int ColSpan;
	}

	internal class ChallengeBomb
	{
		public string Name { get; set; }
		public Bomb[] Bombs { get; set; }
		public List<Completion> Completions { get; set; }
		public int FirstCompletion { get; set; }
	}

	internal class Bomb
	{
		public int Modules { get; set; }
		public int Time { get; set; }
		public int Strikes { get; set; }
		public int Widgets { get; set; }
		public List<Pool> Pools { get; set; }
	}

	internal class Pool
	{
		public string[] Modules { get; set; }
		public int Count { get; set; }
	}

	internal class Completion
	{
		public string Proof { get; set; }
		public int Time { get; set; }
		public List<string> Team { get; set; }
	}
}
