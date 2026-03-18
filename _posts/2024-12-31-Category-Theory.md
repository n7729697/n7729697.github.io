---
title: Category Theory for Programmers - From Composition to Monads
tags: [category theory, functional programming, monads, functors]
style: fill
color: light
description: A long-form guide based on the Uppsala University Category Theory for Programmers reading list, expanded into a continuous path from composition and types to Yoneda, adjunctions, and monads.
---

## Table of Contents

1. [Foundations: Chapters 1-4](#1-foundations-chapters-1-4)
2. [Building Data and Structure: Chapters 5-10](#2-building-data-and-structure-chapters-5-10)
3. [Continuity Bridge: Chapters 11-19](#3-continuity-bridge-chapters-11-19)
4. [Payoff Section: Chapters 20-22](#4-payoff-section-chapters-20-22)
5. [Sources and Attribution](#sources-and-attribution)

## 1. Foundations: Chapters 1-4

The first four chapters establish the core promise of category theory for programmers: it is a disciplined way of talking about composition. That sounds modest, but it is already most of the battle. Large software systems succeed or fail not because we can write isolated functions, but because we can connect computations without losing meaning.

### Composition and Identity

The first chapter, **Category: The Essence of Composition**, begins with the simplest and most important operation in programming: composing two functions. In Haskell notation:

```haskell
(.) :: (b -> c) -> (a -> b) -> a -> c
(g . f) x = g (f x)
```

There is also an identity function:

```haskell
id :: a -> a
id x = x
```

These are not just utilities. They obey laws. Composition is associative, and identity is neutral:

```haskell
h . (g . f) = (h . g) . f
id . f = f
f . id = f
```

This is the first categorical insight. A category is not primarily about objects sitting on shelves. It is about arrows that compose lawfully. The laws matter because they let you refactor without changing meaning. If you regroup a pipeline, or inline an identity-like adapter, the result should still behave the same. Programmers already rely on this informally when reorganizing code into helpers, layers, or modules.

Why should a programmer care? Because lawful composition is a design constraint. If an interface supports composition and has a neutral element, you can scale it. If it does not, every combination becomes bespoke. Logging wrappers, parser combinators, query builders, stream processors, optics, and effect systems all get their leverage from some notion of associative composition plus identity.

Suppose we have:

```haskell
parseInt   :: String -> Int
increment  :: Int -> Int
renderText :: Int -> String
```

Then `renderText . increment . parseInt` is not just shorter than nested calls. It states that this pipeline is built out of stable interfaces whose intermediate details do not need to be re-explained each time. Category theory takes this very ordinary observation and asks: what general mathematics captures it? The answer is the category idea itself.

The transition to the next chapter is natural. Once we talk about arrows abstractly, we should ask what these arrows are in programming. The most obvious answer is: functions between types.

### Types and Functions

Chapter 2, **Types and Functions**, tightens the link between mathematical functions and programming functions. In mathematics, a function is total: each input in its domain maps to exactly one output. In real programs, we routinely write operations that crash, loop, throw, or depend on effects. That mismatch is productive. It tells us what idealized structure we are approximating and where extra machinery will later be needed.

A total function might look like this:

```haskell
succ :: Int -> Int
succ x = x + 1
```

A partial operation in everyday coding often hides inside a total-looking type:

```haskell
head :: [a] -> a
```

This signature pretends every list has a first element. The more honest version is:

```haskell
safeHead :: [a] -> Maybe a
```

That small change already previews later chapters. Once failure is represented in the type, composition changes shape. We are no longer merely connecting `a -> b` to `b -> c`; we are connecting computations with context.

The programmer's payoff here is precision. Types are not just runtime containers or compiler bureaucracy. They specify the kind of morphism we are allowed to compose. This is one reason category theory meshes so well with typed functional programming: both care about the algebra of interfaces.

There is also an important caveat. The popular slogan that Haskell forms a category, often called `Hask`, is useful pedagogically but imperfect. Real languages have bottoms, nontermination, exceptions, and implementation artifacts. Milewski's pedagogical move is the right one: start from the clean case, use it to understand the intended laws, and then interpret real languages as approximations or enriched settings rather than abandoning the theory at the first impurity.

The transition to Chapter 3 is immediate. If types and functions are one category-like world, what other categories exist, and what do they teach us about programs?

### Categories Great and Small

Chapter 3, **Categories Great and Small**, broadens the picture. Categories are not rare. They show up wherever there are things and lawful arrows between them.

The category `Set` has sets as objects and total functions as arrows. Preorders can be seen as categories where there is at most one arrow between any two objects, corresponding to whether one element is less than or equal to another. Monoids can be seen as one-object categories, where the arrows are the monoid elements and composition is the monoid operation.

Each example changes what counts as composition. In a preorder, composition becomes transitivity. In a monoid, composition becomes an associative binary operation on actions. In software engineering, this teaches a useful habit: do not over-identify abstraction with one concrete representation.

A simple programmer-friendly example is string-building with concatenation. A monoid gives us:

```haskell
mempty  :: String
(<>)    :: String -> String -> String
```

If we reinterpret this as a one-object category, then each string-building step is an arrow from the single object back to itself, and composition is concatenation. That viewpoint seems abstract until you notice how often software frameworks depend on exactly this pattern: logs accumulate, queries chain, permissions combine, and configuration fragments merge.

Another useful example is a dependency ordering. Suppose task `A` must happen before `B`, and `B` before `C`. Then the categorical composition is just the derived fact that `A` must happen before `C`. This is not a function pipeline, but the same formal language of arrows and composition applies.

The chapter's lesson is strategic. Category theory gives programmers a way to recognize structural sameness across domains, which becomes essential later when monads, adjunctions, and representable functors start connecting patterns that otherwise look unrelated.

The next move is to return to programming and ask what happens when our arrows are not plain functions but effectful functions.

### Kleisli Categories

Chapter 4, **Kleisli Categories**, is the first major bridge from pure category definitions to programming practice. It asks: what if a function returns not just a value, but a value wrapped in some computational context?

The classic example is partiality via `Maybe`:

```haskell
safeReciprocal :: Double -> Maybe Double
safeReciprocal 0 = Nothing
safeReciprocal x = Just (1 / x)

safeRoot :: Double -> Maybe Double
safeRoot x
  | x < 0     = Nothing
  | otherwise = Just (sqrt x)
```

These do not compose with ordinary `(.)`, because `safeReciprocal` returns `Maybe Double`, while `safeRoot` expects a plain `Double`. The usual workaround is to unwrap and rewrap by hand. The Kleisli viewpoint says that this manual plumbing is itself a compositional structure.

Define a composition operator for effectful arrows:

```haskell
(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c
f >=> g = \x -> case f x of
  Nothing -> Nothing
  Just y  -> g y
```

Now `safeReciprocal >=> safeRoot` is a legitimate composite arrow in a different category, the Kleisli category for `Maybe`. The objects are the same types as before, but the arrows are of the form `a -> Maybe b`.

Why should a programmer care? Because this is the first place where category theory directly explains an engineering pattern: effectful composition is not a broken version of ordinary composition. It is composition in a different category. That reframe removes a lot of apparent ad hoc complexity. Once you understand the category, the helper operations are no longer mysterious.

The next cluster of chapters shows how data types are built and how structure-preserving operations act on them.

## 2. Building Data and Structure: Chapters 5-10

Chapters 5 through 10 move from composition alone to the structure of data and reusable transformations. This block is where category theory starts to feel familiar to programmers: products look like tuples, coproducts look like tagged unions, algebraic data types appear naturally, functors explain `map`, function types reveal currying as structure, and natural transformations explain how one abstraction can be translated into another without inspecting the payload.

### Products Before Coproducts

Chapter 5, **Products and Coproducts**, begins from universal properties rather than concrete syntax. That is why the reading group split the chapter before **Coproduct**. The first half develops initial objects, terminal objects, duality, isomorphisms, and products.

A terminal object is one with exactly one arrow coming into it from any object. In programming, `()` plays that role well: every value can be ignored and mapped to unit. Dually, an initial object is one with exactly one arrow going out of it to any object. In typed programming, an empty type like `Void` behaves this way because from impossibility anything follows.

Products are characterized not by being pairs syntactically, but by their projections and universality. A product of `a` and `b` is something that lets you recover an `a` and a `b`, and it is the most general such construction. In Haskell that is the pair type:

```haskell
fst :: (a, b) -> a
snd :: (a, b) -> b
```

Why does this matter? Because universal properties explain interface design better than implementation details. If a type supports projections into its components, and every other candidate factors uniquely through it, then you have the right abstraction. A record type is product-like for the same reason:

```haskell
data Person = Person
  { name :: String
  , age  :: Int
  }
```

Category theory explains why tuples and records are canonical ways of packaging independent pieces of information.

Duality also matters here. Reverse the arrows and products become coproducts, terminal becomes initial. Once you understand one universal construction well, the dual construction often comes almost for free.

### Coproducts and Algebraic Data Types

The second half of Chapter 5 introduces **Coproduct**, and Chapter 6, **Simple Algebraic Data Types**, makes the programming consequences explicit. If products represent "and", coproducts represent "or". In Haskell, the standard example is `Either`:

```haskell
data Either a b = Left a | Right b
```

The injections `Left` and `Right` play the role dual to projections. A value of type `Either a b` carries one of the alternatives together with a tag indicating which side was chosen.

This is where algebraic data types become mathematically transparent. A type can be built from sums and products. For example:

```haskell
data Shape
  = Circle Double
  | Rectangle Double Double
```

`Circle Double` is one constructor carrying one field. `Rectangle Double Double` is another constructor carrying a product of two fields. The whole type is a coproduct of constructor-specific products.

Programmers should care because this is not just a naming convention. It explains pattern matching, case analysis, serialization, and API design. If your domain concept has alternative cases, a coproduct-like encoding is often the principled representation. If each case carries several independent fields, those fields form products. Once seen this way, ADTs are not language-specific magic. They are structured combinations of universal constructions.

Isomorphisms become useful here too. Two types can differ syntactically and still carry the same information. For instance, `(a, ())` is isomorphic to `a`, and `Either Void a` is isomorphic to `a`. These identities are not just cute. They support refactoring and simplify proofs of equivalence between encodings.

The transition to functors is now natural. Once we have structured data types, we want systematic ways to apply functions inside them.

### Functors

Chapter 7, **Functors**, gives the categorical account of lifting computation through structure. A functor maps objects to objects and arrows to arrows while preserving identity and composition. In programming terms, this is the story of `fmap`.

```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

A list functor maps a type `a` to `[a]`, and a function `a -> b` to a function `[a] -> [b]` by applying the function elementwise. `Maybe` does the same but with optionality. Trees, parsers, readers, and many other abstractions fit the pattern.

The laws matter:

```haskell
fmap id = id
fmap (g . f) = fmap g . fmap f
```

These are exactly the laws saying the lifting preserves categorical structure. For programmers, the payoff is massive. If you can express an abstraction as a lawful functor, then mapping over it becomes generic and predictable.

Consider:

```haskell
fmap (+1) (Just 4)    == Just 5
fmap (+1) [1,2,3]     == [2,3,4]
```

The contexts differ, but the pattern is the same. Category theory tells us why: both are endofunctors on the category of types and functions.

The functor does not tell you how to combine multiple effects or branch on them. It only tells you how to transport a pure function through a context. That modesty is useful because later abstractions, like applicatives and monads, can be seen as additional structure built on top of the functor base.

### Functoriality

Chapter 8, **Functoriality**, deepens the idea. The important lesson is that functorial behavior is not restricted to the most obvious `map over container` pattern. The real question is: does a construction act systematically on arrows?

For example, fixing one parameter of `Either e a` gives a functor in `a`. The reader type `(r -> a)` is also a functor in `a`: mapping a function over a reader composes on the output side. In more advanced discussions, one also meets bifunctors, contravariant functors, and profunctor-like patterns, but the programmer's core lesson is simpler. Structure is meaningful when it tells you how interfaces transform under change.

Suppose you have:

```haskell
newtype Reader r a = Reader { runReader :: r -> a }

mapReader :: (a -> b) -> Reader r a -> Reader r b
mapReader f (Reader g) = Reader (f . g)
```

This is functoriality in action. The surrounding context `r -> _` remains fixed while the result type evolves under the mapped function.

Why should a programmer care? Because this chapter teaches you to ask the right abstraction question. Not "Is this a container?" but "Can this construction be made to preserve composition?" Many APIs become easier to reason about once you identify the action they have on morphisms.

### Function Types as Exponentials

Chapter 9, **Function Types**, revisits something programmers use constantly but rarely classify structurally: the function type itself. Category theory views `b^a`, or `a -> b`, as an exponential object, tied to products through currying.

The programmer already knows the practical version:

```haskell
curry   :: ((a, b) -> c) -> a -> b -> c
uncurry :: (a -> b -> c) -> (a, b) -> c
```

Category theory adds the explanation that currying is not a language trick. It expresses a universal property: a map from a product into `c` can be represented equivalently as a map from one factor into the exponential by the other factor.

This matters because it places higher-order programming inside the same structural story as products and coproducts. Closures, callbacks, readers, dependency injection, and function-returning APIs all become instances of a general construction rather than isolated language features.

For programmers, the practical takeaway is that function types are not "just code pointers." They are first-class mathematical objects with predictable algebraic behavior. That perspective pays off immediately in the next chapter.

### Natural Transformations

Chapter 10, **Natural Transformations**, asks what it means to translate between two functors in a way that respects structure. A natural transformation is a family of component functions that commute with the action of `fmap`. In Haskell, a useful rule of thumb is a polymorphic function of shape:

```haskell
forall a. F a -> G a
```

A familiar example is converting a list to an optional value by taking the first element if it exists:

```haskell
listToMaybe :: [a] -> Maybe a
```

This transformation does not care what `a` is. It only rearranges the surrounding structure. That is exactly why it feels natural in the categorical sense.

Why should a programmer care? Because many elegant APIs depend on this restriction. If a transformation is polymorphic and natural, it is easier to test, refactor, and reason about.

At this point the first scheduled half of the reading group ends. The reader has categories, effectful composition, products, coproducts, ADTs, functors, exponentials, and natural transformations. The remaining step is to explain why the skipped middle chapters matter before returning to monads.

## 3. Continuity Bridge: Chapters 11-19

The bridge from Chapter 10 to Chapter 20 is where category theory becomes a coherent story rather than a collection of abstractions. If you jump directly from natural transformations to monads, you can still learn how to use `Maybe`, `List`, `Reader`, and `State`, but you miss why monads sit in a larger network of ideas.

### 3A. From Programming Style to Universal Constructions

Chapter 11, **Declarative Programming**, is about a shift in emphasis. Instead of describing a sequence of machine steps, declarative programming tries to describe what a computation means. Category theory is helpful here because it prefers equations, universal properties, and compositional laws over operational detail.

This is already visible in ordinary functional code. When we write `map f . map g = map (f . g)`, we are expressing a law about meaning, not a particular execution strategy. Declarative style matters because it scales reasoning. If a function is specified by algebraic laws, we can optimize, refactor, or parallelize it without changing the specification.

Chapter 12, **Limits and Colimits**, then generalizes earlier constructions. Products are one example of a limit. Coproducts are one example of a colimit. The categorical move is to stop memorizing individual gadgets and instead understand the universal pattern that produces them.

A limit can be read as the most general object that consistently summarizes a diagram. Products already fit the description: a pair gathers two values together in the most universal way. Pullbacks and equalizers are more advanced examples, but the lesson is the same. Universal constructions describe the shape of interfaces by their relationships, not their implementation.

Colimits play the dual role. Coproducts, coequalizers, and pushouts are ways of gluing structures together subject to compatibility constraints. In software terms, colimit-like thinking appears whenever alternative sources, variants, or merged interfaces are being assembled.

The section on continuity in the book adds another conceptual layer: functors that preserve certain limits deserve to be called continuous in the categorical sense. The exact technical conditions are more general than most everyday code requires, but the programmer's intuition is valuable. Some abstractions preserve structure faithfully; others forget or distort it.

Chapter 13, **Free Monoids**, brings universal construction back to a very concrete programming object: lists. A monoid is an associative binary operation with an identity element. Lists form the free monoid on a set of generators:

```haskell
mempty :: [a]
mempty = []

(<>) :: [a] -> [a] -> [a]
(<>) = (++)
```

Why are lists "free"? Because any function from elements into a target monoid extends uniquely to a monoid homomorphism from lists into that monoid. That sounds formal, but it captures a common programming pattern. If you know how to interpret a single token, event, or symbol, then folding a list of them into a summary should be determined systematically.

This matters for parsing, logging, syntax trees, command accumulation, and streaming systems. Free constructions let you build syntax or structure first, and interpret it later. That separation between description and interpretation is one of the deepest recurring themes in functional programming.

The bridge so far is this: declarative programming emphasizes laws over steps, limits and colimits organize universal constructions, and free monoids show how a practical data type inherits a universal meaning. The next block moves from universal construction to representation.

### 3B. From Representability to Yoneda

Chapter 14, **Representable Functors**, begins with the hom functor. In a category, fixing an object `a` gives a functor `C(a, -)`. In Haskell-flavored notation, that looks like `(a -> -)`. A functor is representable if it is naturally isomorphic to such a hom functor.

The cleanest programming example is a fixed-size pair:

```haskell
data Pair a = Pair a a
```

This functor is representable by `Bool`, because a pair can be viewed as a function from two positions to values:

```haskell
index :: Pair a -> Bool -> a
index (Pair x y) False = x
index (Pair x y) True  = y

tabulate :: (Bool -> a) -> Pair a
tabulate f = Pair (f False) (f True)
```

The point is that `Pair` can be described entirely by an indexing type. Many useful abstractions in programming become clearer when seen this way: arrays indexed by finite sets, readers indexed by environments, tries indexed by paths, and generic tabulation schemes all live near representability.

Chapter 15, **The Yoneda Lemma**, is the famous midpoint where category theory suddenly looks less mystical. In one programmer-friendly form, it says that for a covariant functor `F`, natural transformations from `Hom(a, -)` to `F` correspond exactly to values of type `F a`.

In Haskell style, a common mnemonic is:

```haskell
forall x. (a -> x) -> F x    ~    F a
```

The correspondence is simple and powerful. Given `fa :: F a`, we can turn it into a polymorphic mapper:

```haskell
\k -> fmap k fa
```

And given such a polymorphic mapper, we recover `F a` by applying it to `id`.

Why should a programmer care? Because Yoneda explains why so much polymorphic code is determined by surprisingly little information. If a function is truly natural and polymorphic, it cannot do arbitrary type-specific work. Its behavior collapses to structure already present in `F a`. This is one reason parametric polymorphism is such a strong design tool: it excludes large classes of nonsense implementations.

The book's discussion of **Co-Yoneda** adds a practical optimization lens. Co-Yoneda lets you factor mapping through a functor so that transformations can be accumulated and applied later. In real libraries, this idea supports fusion, deferred mapping, and cheaper representation changes.

Chapter 16, **Yoneda Embedding**, extends the lesson. Objects are determined by how they relate to other objects through hom-functors. The embedding tells us that a category can be faithfully viewed inside a category of functors. For programmers, the headline is this: an abstraction is often best understood not by staring at its internal fields, but by examining the maps into it, out of it, and between the structures it induces.

This is already how good API design works. We understand a collection not by its private memory layout but by its constructors, eliminators, mapping behavior, and natural translations to neighboring abstractions. Yoneda makes that instinct precise. Naturality also matters here: it guarantees that these representations are not mere coincidences, but stable structure-preserving correspondences.

By the end of this block, representation has replaced implementation as the main lens. That is the right setup for morphisms and adjunctions.

### 3C. From Morphisms to Adjunctions

Chapter 17, **It's All About Morphisms**, sharpens a categorical habit that is easy to state and hard to internalize: objects matter through their relationships. In programming, this means that the meaning of a type is often best expressed by the functions you can write to and from it, and by the laws those functions satisfy.

Hom-sets make this explicit. If two types support isomorphic families of maps in all relevant contexts, they often behave as the same abstraction for practical purposes. This way of thinking is foreign at first because programmers are used to concrete representations. But it becomes natural once you spend time with interfaces. The public meaning of a type is revealed by composition patterns, not by hidden implementation detail.

Chapter 18, **Adjunctions**, is one of the most rewarding chapters in the book because it uncovers a deep source of familiar programming patterns. An adjunction between functors `F` and `G` is a natural isomorphism:

$$
Hom(F a, b) \cong Hom(a, G b)
$$

For a programmer, the most familiar example is currying:

```haskell
((a, b) -> c)  ~  (a -> (b -> c))
```

This can be read categorically as product with `a` being left adjoint to exponential by `a`. Suddenly currying is not just syntax. It is an instance of a general machine for relating two ways of structuring computation.

The language of unit and counit gives the adjunction operational handles. The unit injects an object into the round-trip through the adjunction. The counit collapses the round-trip on the other side. In programming, these maps often correspond to introducing structure and then evaluating or forgetting it.

Why should a programmer care? Because adjunctions explain why certain pairs of abstractions fit together with almost suspicious elegance. Products and exponentials, free and forgetful constructions, syntax and semantics, embedding and evaluation all frequently arise as adjoint situations.

Chapter 19, **Free/Forgetful Adjunctions**, makes the point concrete. A forgetful functor strips structure and remembers the underlying carrier. A free functor adds the minimal structure needed. The list construction as free monoid is the canonical example. Given plain symbols, the free side builds all finite sequences. The forgetful side discards the monoid laws as explicit structure and just remembers the carrier set.

This chapter is the final missing step before monads because adjunctions generate monads. Once you see free/forgetful pairs, you stop reading monads as magic wrappers and start reading them as algebraic shadows of deeper categorical structure.

## 4. Payoff Section: Chapters 20-22

The final scheduled block returns to the explicitly programmer-facing material. By now the reader has the right context. Monads are not the beginning of category theory for programmers. They are one outcome of the story: first composition, then data structure, then representation, then adjunction, then monads.

### Chapter 20: Monads, Programmer's Definition

Chapter 20, **Monads: Programmer's Definition**, starts from the practical side. A monad can be presented as a functor equipped with operations such as `return` and bind, or equivalently `pure` and `join`. But the book wisely connects it to the Kleisli view first, because programmers already understand sequencing computations with context.

For `Maybe`, the bind operator is:

```haskell
(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b
Nothing >>= _ = Nothing
Just x  >>= f = f x
```

The fish operator emphasizes composition of effectful arrows directly:

```haskell
(>=>) :: (a -> m b) -> (b -> m c) -> a -> m c
```

This is the monadic continuation of the Kleisli category idea from Chapter 4. A monad gives enough structure to sequence these contextual functions associatively, with an identity arrow supplied by `return` or `pure`.

Why should a programmer care? Because monads solve a recurring interface problem. Once results come wrapped in context, ordinary composition is no longer enough. Bind says how to feed the plain result of one computation into the next without losing the context's discipline.

A simple example is a safe numeric pipeline:

```haskell
parsePositive :: String -> Maybe Int
safeHalf      :: Int -> Maybe Int
safeShow      :: Int -> Maybe String
```

Monadic composition lets the failure behavior propagate automatically. The business logic stays visible; the error plumbing becomes reusable structure.

The `do` notation is then just syntax for bind-based sequencing:

```haskell
do x <- parsePositive input
   y <- safeHalf x
   safeShow y
```

This matters because it makes monadic code look imperative while keeping the denotational story compositional. The notation is convenient, but the semantics live in the monad's operations and laws.

### Chapter 21: Monads and Effects

Chapter 21, **Monads and Effects**, is where many programmers first feel the force of the abstraction. The basic problem is that pure functions alone do not explain how to sequence computations involving failure, choice, environment, logging, state, exceptions, or interaction. The solution is to make the effect part of the type and provide a lawful composition discipline.

The reading-group schedule split this chapter after **State**, which is sensible because the first half covers the core family of everyday effect patterns.

**Partiality** is the `Maybe` story. A function may fail to return a value, and bind propagates failure.

**Nondeterminism** often uses lists. A computation returns many possible results, and bind explores combinations:

```haskell
pairs :: [a] -> [b] -> [(a, b)]
pairs xs ys = do
  x <- xs
  y <- ys
  pure (x, y)
```

**Read-only state** is the `Reader r` pattern, where computation depends on a shared environment:

```haskell
newtype Reader r a = Reader { runReader :: r -> a }
```

**Write-only state** is `Writer`, where results are paired with an accumulated log or output.

**State** combines reading and writing threaded state:

```haskell
newtype State s a = State { runState :: s -> (a, s) }
```

These examples show why monads are useful. Each effect has a different operational meaning, but the type class shape lets programmers reuse a sequencing idiom while still respecting the specific laws of each context.

**Exceptions** refine partiality by carrying structured error information, often as `Either e a`.

**Continuations** model control flow by representing "the rest of the computation" explicitly. They are conceptually powerful because they show monads are not just about data plumbing, but about control structure itself.

**Interactive input** and **interactive output** push toward the boundary between pure description and runtime interaction. In practice, `IO` is often introduced here as the monadic interface for sequencing interactions with the external world. The important caution is not to overclaim. `IO` in a real language involves runtime and implementation details beyond the simplest categorical slogan. Still, the monadic interface usefully captures the idea that effectful steps must be ordered and composed lawfully.

What this chapter really teaches is that effects are not a tax on pure programming. They are structured extensions of it. The type tells you what kind of context a computation lives in, and the monad tells you how such computations compose.

### Chapter 22: Monads Categorically

Chapter 22, **Monads Categorically**, returns to the high-level viewpoint and closes the loop with the skipped middle chapters. The key claim is beautiful: a monad is a monoid in a monoidal category.

Which monoidal category? The category of endofunctors on a base category, with functor composition as the tensor product and the identity functor as the unit. In that setting, a monad consists of:

- an endofunctor `M`,
- a unit `Id => M`,
- a multiplication `M . M => M`.

For programmers, the multiplication is the familiar flattening map:

```haskell
join :: M (M a) -> M a
```

This is not just elegance for its own sake. It explains why monad laws mirror monoid laws. Associativity of multiplication corresponds to associativity of flattening nested context, and the unit laws correspond to `return` being neutral.

The chapter's treatment of **monoidal categories** and **monoid in a monoidal category** places monads in the same algebraic pattern that already appeared for strings, lists, and other compositional structures.

The final payoff is the link **from adjunctions to monads**. If `F` is left adjoint to `G`, then the composite `G ∘ F` carries a monad structure. This is why the bridge chapters matter so much. Once you see that, several programming patterns align at once:

- free constructions build syntax or structure,
- forgetful functors expose underlying carriers,
- adjunctions relate the two,
- the resulting composition produces monadic structure.

This perspective helps programmers avoid a common trap. If you learn monads only as `bind` plus examples, every new monad can feel like another special case to memorize. With the categorical backstory, monads look like a predictable consequence of lawful composition, universal construction, and adjoint pairs.

That is the real endpoint of the reading path. Monads are important, but the bigger lesson is that category theory compresses many design principles into a small number of reusable patterns.

## Sources and Attribution

This post is based on the public **Category Theory for Programmers** reading-group page at Uppsala University and the public book materials for Bartosz Milewski's *Category Theory for Programmers*.

- Uppsala University reading-group schedule: [https://uu-ctfp.github.io/](https://uu-ctfp.github.io/)
- Public CTFP book repository and canonical chapter list: [https://github.com/hmemcpy/milewski-ctfp-pdf](https://github.com/hmemcpy/milewski-ctfp-pdf)
- Bartosz Milewski's CTFP preface: [https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

The explanations above are paraphrased rather than quoted from the original sources.
